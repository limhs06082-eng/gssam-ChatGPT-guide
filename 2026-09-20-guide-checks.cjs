/* Runs the actual lesson data and guide application with a minimal DOM in node:vm.
   Checks state/rendered markup/event handling, not real browser layout or storage permissions. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const KEY = 'gssam-guide-progress-v1';
const files = ['2026-09-20-lessons.js', '2026-09-20-foundations.js', '2026-09-21-chat-practice.js', '2026-09-21-work-practice.js', '2026-09-20-guide.js'];
const sources = files.map(file => fs.readFileSync(path.join(__dirname, file), 'utf8'));

function setup(saved, hash = '#/') {
  const data = new Map(saved === undefined ? [] : [[KEY, JSON.stringify(saved)]]);
  const handlers = {}, windowHandlers = {}, nodes = new Map();
  class Element {
    constructor(attrs = {}) {
      this.attrs = attrs; this.dataset = {}; this.events = {}; this.value = ''; this.innerHTML = ''; this.textContent = '';
      for (const [k,v] of Object.entries(attrs)) if (k.startsWith('data-')) this.dataset[k.slice(5).replace(/-([a-z])/g, (_,c) => c.toUpperCase())] = v;
      const classes = new Set((attrs.class || '').split(' '));
      this.classList = {add: c => classes.add(c), remove: c => classes.delete(c), contains: c => classes.has(c), toggle(c, force) { const value = force ?? !classes.has(c); value ? classes.add(c) : classes.delete(c); return value; }};
    }
    setAttribute(k,v) { this.attrs[k] = v; }
    getAttribute(k) { return this.attrs[k] ?? null; }
    hasAttribute(k) { return Object.hasOwn(this.attrs,k); }
    removeAttribute(k) { delete this.attrs[k]; }
    addEventListener(k,fn) { this.events[k] = fn; }
    closest() { return this; }
    focus() {} scrollIntoView() {} after() {}
    showModal() { this.open = true; } close() { this.open = false; }
    get hash() { return this.attrs.href || ''; }
  }
  for (const sel of ['#main','#toast','.site-header','.top-nav','.mobile-menu','#search-dialog','#search-input','#search-results']) nodes.set(sel, new Element());
  const main = nodes.get('#main');
  const parse = (html, tag) => [...html.matchAll(new RegExp('<'+tag+'\\b([^>]*)>', 'g'))].map(m => {
    const attrs = Object.fromEntries([...m[1].matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map(a => [a[1],a[2] ?? '']));
    return new Element(attrs);
  });
  let dynamic = {};
  const refresh = () => { dynamic = {complete: parse(main.innerHTML,'button').find(e => e.hasAttribute('data-complete')), links: parse(main.innerHTML,'a'), sidebar: new Element()}; };
  const document = {
    querySelector(sel) { if (nodes.has(sel)) return nodes.get(sel); if(sel === '[data-complete]') return dynamic.complete || null; if(sel === '.sidebar-note') return main.innerHTML.includes('sidebar-note') ? dynamic.sidebar : null; return null; },
    querySelectorAll(sel) { if(sel === '.lesson-sidebar .sidebar-link') return (dynamic.links || []).filter(e => e.classList.contains('sidebar-link')); return []; },
    addEventListener: (name,fn) => handlers[name] = fn,
    getElementById: () => null,
    createElement: () => new Element()
  };
  const window = {scrollY:0, scrollTo() {}, addEventListener: (name,fn) => windowHandlers[name] = fn};
  const location = {hash};
  const context = vm.createContext({document,window,location,URLSearchParams,console,localStorage:{getItem:k => data.get(k) ?? null,setItem:(k,v) => data.set(k,v)},setTimeout:() => 1,clearTimeout() {},requestAnimationFrame:fn => fn()});
  sources.forEach((source,i) => vm.runInContext(source,context,{filename:files[i]}));
  refresh();
  return {
    html: () => main.innerHTML,
    saved: () => JSON.parse(data.get(KEY) || 'null'),
    lessons: window.GUIDE_LESSONS,
    route(hash) { location.hash=hash; windowHandlers.hashchange(); refresh(); },
    async complete() { assert.ok(dynamic.complete,'Rendered completion button exists'); await handlers.click({target:dynamic.complete}); return dynamic.complete; },
    search(query) { nodes.get('#search-input').value=query; nodes.get('#search-input').events.input(); return nodes.get('#search-results').innerHTML; },
    storage(value) { windowHandlers.storage({key:KEY,newValue:JSON.stringify(value)}); },
    sidebar: () => dynamic.sidebar.innerHTML
  };
}

const tests = [];
function test(name, fn) { tests.push([name,fn]); }
test('Three, seven and ten-lesson progress survive thirteen-lesson upgrade', () => {
  for (const saved of [{completed:['chat','work'],last:'work'}, {completed:['chat','work','privacy','prompt'],last:'privacy'}, {completed:['choose','setup','prompt','privacy','chat','files','search','projects','work','codex'],last:'projects'}]) {
    const app=setup(saved);
    assert.ok(app.html().includes(saved.completed.length+'/13 완료'));
    assert.ok(app.html().includes('href="#/lesson/'+saved.last+'"'));
    assert.deepEqual(app.saved(),saved);
    app.route('#/lesson/'+saved.last);
    assert.deepEqual(app.saved(),saved);
  }
});
test('All four foundations render real content and consecutive previous/next links', () => {
  const app=setup();
  const sequence=['choose','setup','prompt','privacy'];
  sequence.forEach((key,i) => {
    app.route('#/lesson/'+key);
    assert.ok(app.html().includes(app.lessons[key].title));
    assert.match(app.html(),/오늘의 완성 목표/);
    assert.doesNotMatch(app.html(),/undefined|이 페이지는 찾을 수 없어요/);
    const nav=app.html().match(/<nav class="lesson-nav"[\s\S]*?<\/nav>/)[0];
    assert.ok(nav.includes('href="'+(i===0?'#/start':'#/lesson/'+sequence[i-1])+'"'));
    assert.ok(nav.includes('href="#/lesson/'+(sequence[i+1] || 'chat')+'"'));
  });
});
test('Learning map exposes exactly thirteen usable lessons and 17 prepared topics', () => {
  const app=setup(undefined,'#/courses');
  assert.equal((app.html().match(/class="course-row published"/g)||[]).length,13);
  assert.equal((app.html().match(/class="course-row planned"/g)||[]).length,17);
  for(const key of ['choose','setup','prompt','privacy','chat','files','search','projects','work','compare','documents','review','codex']) assert.ok(app.html().includes('href="#/lesson/'+key+'"'));
  const chat=app.html().match(/<section class="course-group" data-group="chat">([\s\S]*?)<\/section>/)[1];
  const rows=[...chat.matchAll(/<(a|div)\b[^>]*class="course-row (published|planned)"[^>]*>[\s\S]*?<\/\1>/g)].map(m=>m[0]);
  assert.equal(rows.length,8);
  rows.forEach((row,i)=> {
    const key={0:'chat',3:'files',5:'search',6:'projects'}[i];
    if(key) assert.ok(row.includes('href="#/lesson/'+key+'"'));
    else assert.match(row,/course-row planned/);
  });
});
test('New completion persists through restart, cancellation persists, old completions remain', async () => {
  let app=setup({completed:['chat','work','privacy','prompt'],last:'privacy'},'#/lesson/review');
  const button=await app.complete();
  assert.equal(button.getAttribute('aria-pressed'),'true');
  assert.deepEqual(app.saved(),{completed:['chat','work','privacy','prompt','review'],last:'review'});
  app=setup(app.saved(),'#/lesson/review');
  assert.match(app.html(),/전체 학습 5\/13 완료/);
  assert.match(app.html(),/✓ 학습 완료 · 취소/);
  await app.complete();
  app=setup(app.saved());
  assert.deepEqual(app.saved().completed,['chat','work','privacy','prompt']);
  assert.match(app.html(),/4\/13 완료/);
});
test('Every new title and a text-only body fragment are searchable', () => {
  const app=setup();
  for(const key of ['choose','setup','prompt','privacy','files','search','projects','compare','documents','review']) {
    const lesson=app.lessons[key];
    assert.ok(app.search(lesson.title).includes('href="#/lesson/'+key+'"'));
    const fragment=lesson.steps.map(s=>s.text).find(s=>s.length>30).slice(5,30);
    assert.ok(app.search(fragment).includes('href="#/lesson/'+key+'"'),key+' body search');
  }
  assert.match(app.search('존재하지않는검색어xyz'),/맞는 결과가 없어요/);
});
test('Cross-tab completion event updates visible lesson count and button', async () => {
  const app=setup({completed:['chat'],last:'chat'},'#/lesson/choose');
  app.storage({completed:['chat','choose'],last:'choose'});
  assert.match(app.sidebar(),/전체 학습 2\/13 완료/);
  const button=await app.complete();
  assert.equal(button.getAttribute('aria-pressed'),'false');
  assert.deepEqual(app.saved().completed,['chat']);
});
test('Unknown and duplicate legacy completion entries cannot inflate progress', () => {
  const app=setup({completed:['chat','chat','removed','privacy'],last:'removed'});
  app.route('#/lesson/setup');
  assert.match(app.html(),/전체 학습 2\/13 완료/);
  assert.deepEqual(app.saved(),{completed:['chat','privacy'],last:'setup'});
});
test('Unknown and prototype property routes render not-found without overwriting resume state', () => {
  const app=setup({completed:['chat'],last:'work'});
  for(const key of ['missing','__proto__','constructor','toString']) {
    app.route('#/lesson/'+key);
    assert.match(app.html(),/이 페이지는 찾을 수 없어요/);
    assert.deepEqual(app.saved(),{completed:['chat'],last:'work'});
  }
});
test('Practice lessons render with correct links from Chat through Work to Codex', () => {
  const app=setup();
  const sequence=['privacy','chat','files','search','projects','work','compare','documents','review','codex'];
  sequence.slice(1,-1).forEach((key,i)=> {
    app.route('#/lesson/'+key);
    assert.ok(app.html().includes(app.lessons[key].title));
    assert.doesNotMatch(app.html(),/undefined|이 페이지는 찾을 수 없어요/);
    const nav=app.html().match(/<nav class="lesson-nav"[\s\S]*?<\/nav>/)[0];
    assert.ok(nav.includes('href="#/lesson/'+sequence[i]+'"'));
    assert.ok(nav.includes('href="#/lesson/'+sequence[i+2]+'"'));
  });
});
test('Work learning map publishes only overview, comparison, documents and review', () => {
  const app=setup(undefined,'#/courses');
  const work=app.html().match(/<section class="course-group" data-group="work">([\s\S]*?)<\/section>/)[1];
  const rows=[...work.matchAll(/<(a|div)\b[^>]*class="course-row (published|planned)"[^>]*>[\s\S]*?<\/\1>/g)].map(m=>m[0]);
  assert.equal(rows.length,8);
  rows.forEach((row,i)=> {
    const key={0:'work',3:'compare',4:'documents',6:'review'}[i];
    if(key) assert.ok(row.includes('href="#/lesson/'+key+'"'));
    else assert.match(row,/course-row planned/);
  });
});
test('Published entrypoint loads new lesson script before guide and rendered local downloads exist', () => {
  const workflow=fs.readFileSync(path.join(__dirname,'.github/workflows/2026-09-20-pages.yml'),'utf8');
  assert.match(workflow,/cp 2026-09-20-guide\.html _site\/index\.html/);
  assert.match(workflow,/cp [^\n]*2026-09-21-chat-practice\.js[^\n]* _site\//);
  assert.match(workflow,/cp [^\n]*2026-09-21-work-practice\.js[^\n]* _site\//);
  for(const entry of ['2026-09-20-guide.html']) {
    const html=fs.readFileSync(path.join(__dirname,entry),'utf8');
    const scripts=[...html.matchAll(/<script\b[^>]*src="([^"?]+)(?:\?[^\"]*)?"/g)].map(m=>m[1].replace(/^\.\//,''));
    assert.deepEqual(scripts.filter(script=>files.includes(script)),files,entry+' uses same application script load order as VM checks');
  }
  const app=setup();
  app.route('#/resources');
  const copiedFiles=workflow.split('\n').map(line=>line.trim()).filter(line=>/^cp .+ _site\/$/.test(line)).flatMap(line=>line.split(/\s+/).slice(1,-1));
  for(const resource of ['2026-09-21-탐구준비물-비교자료.csv','2026-09-21-공개수업-검토용초안.txt','2026-09-21-Work-결과검토표.md']) {
    assert.ok(copiedFiles.includes(resource),'Workflow publishes '+resource);
    assert.ok(app.html().includes('href="./'+encodeURIComponent(resource)+'"'),'Resource page links '+resource);
    assert.ok(fs.existsSync(path.join(__dirname,resource)),'Resource file exists '+resource);
  }
  for(const route of ['#/resources','#/lesson/files','#/lesson/search','#/lesson/projects','#/lesson/compare','#/lesson/documents','#/lesson/review']) {
    app.route(route);
    for(const match of app.html().matchAll(/href="(\.\/[^"#?]+)"/g)) {
      const filename=decodeURIComponent(match[1]);
      assert.ok(fs.existsSync(path.join(__dirname,filename)),route+' linked file '+filename);
    }
  }
});
(async () => {
  for (const [name,fn] of tests) { await fn(); console.log('PASS '+name); }
  console.log(`\n${tests.length} application behavior checks passed. DOM/storage mocked; browser verification remains separate.`);
})().catch(error => { console.error(error); process.exitCode=1; });
