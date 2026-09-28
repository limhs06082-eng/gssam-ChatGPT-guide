/* Manual, dependency-free external-link check. Not part of the Pages deployment workflow.
   Run: node 2026-09-28-link-checks.cjs
   Offline tests: node --test 2026-09-28-link-checks-tests.cjs
   Requires Node.js 18 or newer (built-in fetch). */
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const ENTRY = path.join(__dirname, '2026-09-20-guide.html');
const EXAMPLE_GITHUB_HOST = new URL('https://아이디.github.io/').hostname;
const DEFAULT_TIMEOUT_MS = 12000;
const DEFAULT_CONCURRENCY = 4;

function parseHttpsUrl(value) {
  const parsed = new URL(value);
  if (parsed.protocol !== 'https:') throw new Error('https 주소가 아닙니다.');
  return parsed;
}

function decodeEntities(text) {
  return text.replace(/&#(x[\da-f]+|\d+);/gi, (match, value) => {
    const code = value[0].toLowerCase() === 'x' ? parseInt(value.slice(1),16) : Number(value);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
  }).replace(/&nbsp;/gi,' ').replace(/&quot;/gi,'"').replace(/&apos;|&#39;/gi,"'")
    .replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&amp;/gi,'&');
}

function urlBoundary(candidate) {
  // Closing prose parentheses end the address; parentheses inside a URL stay intact.
  const pairs = {'(':')','[':']'};
  const stack = [];
  let end = candidate.length;
  for (let i=0; i<candidate.length; i++) {
    const char = candidate[i];
    if (pairs[char]) stack.push(pairs[char]);
    else if (char === ')' || char === ']') {
      if (stack[stack.length-1] !== char) {end=i; break;}
      stack.pop();
    }
  }
  return candidate.slice(0,end).replace(/[.,;:!]+$/,'');
}

function extractHttpsUrls(text) {
  const urls = new Set();
  // Stop at JS/HTML delimiters and escaped newlines, while preserving ? & # = and URL parentheses.
  for (const match of text.matchAll(/https:\/\/[^\s"'`<>\{\}\\“”‘’]+/gi)) {
    const before = text[match.index-1];
    const after = text[match.index+match[0].length];
    const wholeQuotedUrl = /["'`]/.test(before || '') && before === after;
    // A quoted URL is an exact value: trailing ! . or ) can belong to its query or path.
    const raw = decodeEntities(wholeQuotedUrl ? match[0] : urlBoundary(match[0]));
    try { urls.add(parseHttpsUrl(raw).href); }
    catch { urls.add(raw); } // Malformed URLs remain visible as failures instead of disappearing.
  }
  return [...urls];
}

function getContentFiles(entry = ENTRY) {
  const absoluteEntry = path.resolve(entry);
  const base = path.dirname(absoluteEntry);
  const html = fs.readFileSync(absoluteEntry,'utf8').replace(/<!--[\s\S]*?-->/g,'');
  const files = new Set([absoluteEntry]);
  for (const script of html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)) {
    const src = decodeEntities(script[1]);
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(src)) continue;
    const local = src.split(/[?#]/)[0];
    if (!local.endsWith('.js')) continue;
    const resolved = path.resolve(base,local);
    const relative = path.relative(base,resolved);
    if (relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) {
      throw new Error(`진입점 밖의 스크립트는 읽지 않습니다: ${src}`);
    }
    files.add(resolved);
  }
  return [...files];
}

function collectLinks(contents) {
  const links = new Map();
  for (const {file,text} of contents) {
    for (const url of extractHttpsUrls(text)) {
      if (!links.has(url)) links.set(url,{url,sources:[]});
      const sources = links.get(url).sources;
      if (!sources.includes(file)) sources.push(file);
    }
  }
  return [...links.values()];
}

function isExampleUrl(value) {
  try {
    const host = parseHttpsUrl(value).hostname;
    return host === 'example.org' || host.endsWith('.example.org') || host === EXAMPLE_GITHUB_HOST;
  } catch { return false; }
}

function is403Exception(parsed) {
  return parsed.hostname === 'chatgpt.com' ||
    (parsed.hostname === 'github.com' && parsed.pathname === '/signup');
}

function visibleText(html) {
  return decodeEntities(html.replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim();
}

function isSoft404(value, html) {
  let parsed;
  try { parsed=parseHttpsUrl(value); } catch { return false; }
  if (parsed.hostname !== 'learn.chatgpt.com') return false;
  const displayed = html.replace(/<!--[\s\S]*?-->/g,'')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,'');
  const errorHeading = /^(?:404\s*[:|\-]?\s*)?page\s+not\s+found(?:\s*404)?[.!]?(?:\s*[|–—-]\s*[^|]*)?$/i;
  for (const heading of displayed.matchAll(/<(title|h1)\b[^>]*>([\s\S]*?)<\/\1\s*>/gi)) {
    if (errorHeading.test(visibleText(heading[2]))) return true;
  }
  const body = displayed.match(/<body\b[^>]*>([\s\S]*?)<\/body\s*>/i)?.[1] ||
    displayed.replace(/<head\b[^>]*>[\s\S]*?<\/head\s*>/gi,'');
  // A bare error page can have no heading. A news/article sentence mentioning the phrase is not an error page.
  return /^(?:404\s*[:|\-]?\s*)?page\s+not\s+found(?:\b|$)/i.test(visibleText(body));
}

async function checkLink(link, options = {}) {
  const {fetchImpl = globalThis.fetch, timeoutMs = DEFAULT_TIMEOUT_MS} = options;
  const result = {...link,status:null};
  let parsed;
  try { parsed=parseHttpsUrl(link.url); }
  catch (error) { return {...result,kind:'failed',reason:`URL 오류: ${error.message}`}; }
  if (isExampleUrl(parsed.href)) return {...result,kind:'skipped',reason:'실습용 예시 주소 (요청하지 않음)'};
  if (typeof fetchImpl !== 'function') return {...result,kind:'failed',reason:'Node.js 18 이상이 필요합니다 (fetch 없음).'};
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new Error('요청 제한 시간은 양수여야 합니다.');
  const controller = new AbortController();
  let timer;
  const timeout = new Promise((resolve,reject) => {
    timer=setTimeout(() => {
      controller.abort();
      reject(new Error(`요청 제한 시간 ${timeoutMs}ms 초과 (timeout)`));
    },timeoutMs);
  });
  const request = async () => {
    const response = await fetchImpl(parsed.href,{
      method:'GET',redirect:'follow',signal:controller.signal,
      headers:{'User-Agent':'Gssam-Guide-Link-Check/1.0','Accept':'text/html,application/xhtml+xml,image/*;q=0.8,*/*;q=0.5'}
    });
    result.status=response.status;
    if (response.status === 403 && is403Exception(parsed)) {
      if (response.body?.cancel) await response.body.cancel();
      return {...result,kind:'exception',reason:'자동 요청 차단 예외 · 브라우저에서 수동 확인 필요'};
    }
    if (response.status < 200 || response.status >= 300) {
      if (response.body?.cancel) await response.body.cancel();
      return {...result,kind:'failed',reason:`HTTP ${response.status}`};
    }
    if (parsed.hostname === 'learn.chatgpt.com') {
      const body = await response.text();
      if (isSoft404(parsed.href,body)) return {...result,kind:'failed',reason:'HTTP 200이지만 화면에 Page not found 표시'};
    } else if (response.body?.cancel) await response.body.cancel();
    return {...result,kind:'ok',reason:'정상 응답'};
  };
  try { return await Promise.race([request(),timeout]); }
  catch (error) {
    const reason = controller.signal.aborted ? `요청 제한 시간 ${timeoutMs}ms 초과 (timeout)` :
      `요청 실패: ${error.message || String(error)}${error.cause?.code ? ` (${error.cause.code})` : ''}`;
    return {...result,kind:'failed',reason};
  } finally { clearTimeout(timer); }
}

async function checkLinks(links, options = {}) {
  const concurrency = options.concurrency ?? DEFAULT_CONCURRENCY;
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 16) {
    throw new Error('동시 요청 수는 1~16 사이의 정수여야 합니다.');
  }
  const results = new Array(links.length);
  let next=0;
  await Promise.all(Array.from({length:Math.min(concurrency,links.length)},async () => {
    while (next < links.length) {
      const index=next++;
      results[index]=await checkLink(links[index],options);
      options.onResult?.(results[index]);
    }
  }));
  return results;
}

function summarize(results) {
  const counts={total:results.length,ok:0,failed:0,exception:0,skipped:0};
  for (const result of results) counts[result.kind]++;
  return counts;
}

async function main(options = {}) {
  const print=options.print || console.log;
  const files=getContentFiles(options.entry || ENTRY);
  const contents=files.map(file=>({file:path.relative(__dirname,file),text:fs.readFileSync(file,'utf8')}));
  const links=collectLinks(contents);
  print(`외부 링크 검사: 콘텐츠 ${files.length}개 파일 · 중복 제거 ${links.length}개 주소`);
  print('GET 요청 · 예시 주소는 건너뜀 · 403 예외는 수동 확인 필요로 표시합니다.');
  const labels={ok:'성공',failed:'실패',exception:'수동 확인',skipped:'예시 건너뜀'};
  const results=await checkLinks(links,{...options,onResult:result => {
    print(`[${labels[result.kind]}] ${result.status === null ? 'HTTP —' : `HTTP ${result.status}`} ${result.url}`);
    print(`  ${result.reason} · 출처: ${result.sources.join(', ')}`);
  }});
  const counts=summarize(results);
  print(`총 ${counts.total}개 · 성공 ${counts.ok} · 실패 ${counts.failed} · 수동 확인 ${counts.exception} · 예시 건너뜀 ${counts.skipped}`);
  if (counts.exception) print('수동 확인 항목은 링크가 정상임을 확인한 결과가 아닙니다. 브라우저에서 직접 열어 주세요.');
  return {...counts,exitCode:counts.failed ? 1 : 0};
}

module.exports={extractHttpsUrls,collectLinks,getContentFiles,isExampleUrl,isSoft404,checkLink,checkLinks,summarize,main};
if (require.main === module) {
  main().then(result=>{process.exitCode=result.exitCode;}).catch(error=>{
    console.error(`검사를 시작하지 못했습니다: ${error.message}`);
    process.exitCode=1;
  });
}
