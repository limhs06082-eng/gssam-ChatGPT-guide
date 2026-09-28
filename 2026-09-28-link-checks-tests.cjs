/* Network-free checks for URL boundaries, request results and manual-check exceptions. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const {
  extractHttpsUrls, collectLinks, getContentFiles, isExampleUrl,
  isSoft404, checkLink, checkLinks, summarize
} = require('./2026-09-28-link-checks.cjs');

const response = (status, body = '', url = '') => ({
  status, url, text: async () => body, body: {cancel: async () => {}}
});
const run = (url, status, body = '') => checkLink({url, sources:['test.js']}, {
  fetchImpl: async () => response(status, body, url), timeoutMs:100
});

test('quoted URLs retain query strings, fragments and balanced URL parentheses', () => {
  const input = `url:'https://docs.example.net/path?q=first&other=(second)#part',
    text:'(https://docs.example.net/wiki/Topic_(detail))에서 확인',
    text:'https://docs.example.net/search?items[]=a&items[]=b',
    url:"https://docs.example.net/view?a=1&amp;b=2"`;
  assert.deepEqual(extractHttpsUrls(input), [
    'https://docs.example.net/path?q=first&other=(second)#part',
    'https://docs.example.net/wiki/Topic_(detail)',
    'https://docs.example.net/search?items[]=a&items[]=b',
    'https://docs.example.net/view?a=1&b=2'
  ]);
});

test('prose parentheses, commas and JS newline escapes end the URL', () => {
  assert.deepEqual(extractHttpsUrls(`text:'자료(https://example.org/activity)야. https://아이디.github.io/저장소이름/)에서 확인\\nhttps://docs.example.net/help, 다음'`), [
    'https://example.org/activity',
    new URL('https://아이디.github.io/저장소이름/').href,
    'https://docs.example.net/help'
  ]);
});

test('punctuation in an entire quoted URL remains part of its real path or query', () => {
  assert.deepEqual(extractHttpsUrls(`url:'https://docs.example.net/search?q=hello!',
    url:"https://docs.example.net/item)", url:'https://docs.example.net/name.'`), [
    'https://docs.example.net/search?q=hello!',
    'https://docs.example.net/item)',
    'https://docs.example.net/name.'
  ]);
});

test('URL parsing canonicalizes the hostname and records malformed addresses', () => {
  assert.deepEqual(extractHttpsUrls("'https://CHATGPT.com' 'https://bad..host/%zz' 'https://[bad'"), [
    'https://chatgpt.com/', 'https://bad..host/%zz', 'https://[bad'
  ]);
});

test('duplicate URLs retain every source file once', () => {
  const links = collectLinks([
    {file:'one.js', text:"'https://CHATGPT.com' 'https://chatgpt.com/'"},
    {file:'two.js', text:"'https://chatgpt.com/' 'https://docs.example.net/help'"}
  ]);
  assert.deepEqual(links, [
    {url:'https://chatgpt.com/', sources:['one.js','two.js']},
    {url:'https://docs.example.net/help', sources:['two.js']}
  ]);
});

test('content inventory follows entry scripts including renderer and screen metadata', () => {
  const entry = path.join(__dirname, '2026-09-20-guide.html');
  const files = getContentFiles(entry);
  const html = fs.readFileSync(entry, 'utf8');
  const scriptNames = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)].map(m => path.basename(m[1]));
  assert.deepEqual(files.map(file => path.basename(file)), [path.basename(entry), ...new Set(scriptNames)]);
  assert.ok(files.some(file => file.endsWith('2026-09-20-guide.js')));
  assert.ok(files.some(file => file.endsWith('2026-09-20-screen-guides.js')));
  assert.ok(files.every(file => !file.endsWith('checks.cjs')));
});

test('only example.org and its real subdomains are example hosts', () => {
  assert.equal(isExampleUrl('https://example.org/a'), true);
  assert.equal(isExampleUrl('https://lesson.example.org/a'), true);
  assert.equal(isExampleUrl('https://notexample.org/a'), false);
  assert.equal(isExampleUrl('https://example.org.other.net/a'), false);
});

test('Korean example GitHub host is skipped in Unicode and punycode form', () => {
  assert.equal(isExampleUrl('https://아이디.github.io/저장소이름/'), true);
  assert.equal(isExampleUrl(new URL('https://아이디.github.io/').href), true);
  assert.equal(isExampleUrl('https://real-user.github.io/'), false);
});

test('skipped examples cause no network request and are not counted as successes', async () => {
  let calls = 0;
  const result = await checkLink({url:'https://example.org/demo', sources:['test.js']}, {
    fetchImpl: async () => {calls++; return response(200);}
  });
  assert.equal(calls, 0);
  assert.equal(result.kind, 'skipped');
  assert.equal(summarize([result]).ok, 0);
});

test('successful GET is accepted and the request uses GET with cancellation signal', async () => {
  const result = await checkLink({url:'https://docs.example.net/help', sources:['test.js']}, {
    fetchImpl: async (url, options) => {
      assert.equal(options.method, 'GET');
      assert.ok(options.signal instanceof AbortSignal);
      return response(200, '', url);
    }
  });
  assert.equal(result.kind, 'ok');
  assert.equal(result.status, 200);
});

test('404 and unresolved redirect are failures', async () => {
  assert.equal((await run('https://docs.example.net/missing',404)).kind, 'failed');
  assert.equal((await run('https://docs.example.net/redirect',302)).kind, 'failed');
});

test('learn.chatgpt.com visible Page not found is a soft 404', async () => {
  const result = await run('https://learn.chatgpt.com/docs/missing',200,'<main><h1>Page not found</h1><p>Try another page.</p></main>');
  assert.equal(result.kind, 'failed');
  assert.match(result.reason, /Page not found/);
  assert.equal(isSoft404('https://learn.chatgpt.com/docs/missing','<body>Page&nbsp;not found</body>'), true);
  assert.equal(isSoft404('https://learn.chatgpt.com/docs/missing','<title>Page not found | ChatGPT</title><body></body>'), true);
});

test('script, style and comment contents do not create a soft 404', async () => {
  const html = `<head><style>.message:after{content:"Page not found"}</style></head>
    <body><!-- Page not found --><script>const template='<h1>Page not found</h1>'</script>
    <h1>ChatGPT guide</h1><p>The guide is available.</p></body>`;
  assert.equal((await run('https://learn.chatgpt.com/docs/guide',200,html)).kind, 'ok');
});

test('news body quoting Page not found does not create a soft 404', async () => {
  const html = '<title>News about websites</title><main><h1>News about websites</h1><p>The old site displayed “Page not found” before the update.</p></main>';
  assert.equal((await run('https://learn.chatgpt.com/news/update',200,html)).kind, 'ok');
  assert.equal((await run('https://docs.example.net/news',200,'<h1>Page not found</h1>')).kind, 'ok');
});

test('exact chatgpt.com 403 is manual review, not a success', async () => {
  const result = await run('https://chatgpt.com/',403);
  assert.equal(result.kind,'exception');
  assert.equal(summarize([result]).ok,0);
  assert.equal((await run('https://chatgpt.com/',500)).kind,'failed');
  assert.equal((await run('https://chatgpt.com/',404)).kind,'failed');
});

test('403 on a lookalike host or subdomain remains a failure', async () => {
  assert.equal((await run('https://chatgpt.com.evil.net/',403)).kind,'failed');
  assert.equal((await run('https://help.chatgpt.com/',403)).kind,'failed');
});

test('only github.com/signup 403 is manual review', async () => {
  assert.equal((await run('https://github.com/signup',403)).kind,'exception');
  assert.equal((await run('https://github.com/signup?source=guide',403)).kind,'exception');
  assert.equal((await run('https://github.com/signup-more',403)).kind,'failed');
  assert.equal((await run('https://github.com/other',403)).kind,'failed');
  assert.equal((await run('https://github.com/signup',404)).kind,'failed');
});

test('403 on every other host remains a failure', async () => {
  assert.equal((await run('https://learn.chatgpt.com/docs/quickstart',403)).kind,'failed');
  assert.equal((await run('https://docs.github.com/en/pages',403)).kind,'failed');
});

test('invalid URLs fail without making a request', async () => {
  let calls=0;
  const result = await checkLink({url:'https://[bad',sources:['test.js']}, {
    fetchImpl: async () => {calls++; return response(200);}
  });
  assert.equal(result.kind,'failed');
  assert.equal(calls,0);
});

test('network errors fail with a readable reason', async () => {
  const result = await checkLink({url:'https://docs.example.net/help',sources:['test.js']}, {
    fetchImpl: async () => {throw new Error('DNS lookup failed');}
  });
  assert.equal(result.kind,'failed');
  assert.match(result.reason,/DNS lookup failed/);
});

test('request timeout aborts and still finishes if a transport ignores cancellation', async () => {
  let signal;
  const result = await checkLink({url:'https://docs.example.net/help',sources:['test.js']}, {
    fetchImpl: async (url,options) => {signal=options.signal; return new Promise(()=>{});},
    timeoutMs:15
  });
  assert.equal(result.kind,'failed');
  assert.match(result.reason,/시간|timeout/i);
  assert.equal(signal.aborted,true);
});

test('timeout also covers HTML response body reading', async () => {
  const result = await checkLink({url:'https://learn.chatgpt.com/docs/guide',sources:['test.js']}, {
    fetchImpl: async () => ({status:200, text:async()=>new Promise(()=>{})}), timeoutMs:15
  });
  assert.equal(result.kind,'failed');
  assert.match(result.reason,/시간|timeout/i);
});

test('worker pool respects concurrency and preserves source order', async () => {
  let active=0, maximum=0;
  const links = Array.from({length:7},(_,i)=>({url:`https://docs.example.net/${i}`,sources:['test.js']}));
  const results = await checkLinks(links,{
    concurrency:2,timeoutMs:100,
    fetchImpl: async url => {
      active++; maximum=Math.max(maximum,active);
      await new Promise(resolve=>setTimeout(resolve,3));
      active--; return response(200,'',url);
    }
  });
  assert.equal(maximum,2);
  assert.deepEqual(results.map(result=>result.url),links.map(link=>link.url));
  assert.equal(summarize(results).ok,7);
});

test('summary reports exceptions and examples separately from successes', () => {
  assert.deepEqual(summarize(['ok','ok','failed','exception','skipped'].map(kind=>({kind}))), {
    total:5,ok:2,failed:1,exception:1,skipped:1
  });
});
