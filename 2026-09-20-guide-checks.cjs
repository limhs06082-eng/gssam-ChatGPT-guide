/* Runs the actual lesson data and guide application with a minimal DOM in node:vm.
   Checks state/rendered markup/event handling, not real browser layout or storage permissions. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const KEY = 'gssam-guide-progress-v1';
const files = ['2026-09-20-lessons.js', '2026-09-20-foundations.js', '2026-09-21-chat-practice.js', '2026-09-22-chat-completion.js', '2026-09-21-work-practice.js', '2026-09-22-work-completion.js', '2026-09-21-codex-practice.js', '2026-09-21-codex-basics.js', '2026-09-21-codex-maintenance.js', '2026-09-20-guide.js'];
const sources = files.map(file => fs.readFileSync(path.join(__dirname, file), 'utf8'));
// Single learning order: preparation lessons precede the practice that needs them. Home, map, sidebar and prev/next must all follow it.
const ORDER = {start:['choose','setup','prompt','privacy'], chat:['chat','followup','files','clues','images','search','projects','teaching'], work:['environment','brief','work','redirect','compare','documents','review','reuse'], codex:['workspace','folders','run','codex','plan','modify','changes','debug','backup','publish']};
const ALL = [...ORDER.start, ...ORDER.chat, ...ORDER.work, ...ORDER.codex];
const rowsOf = (html, group) => [...html.match(new RegExp('<section class="course-group" data-group="'+group+'">([\\s\\S]*?)<\\/section>'))[1].matchAll(/<(a|div)\b[^>]*class="course-row (published|planned)[^"]*"[^>]*>[\s\S]*?<\/\1>/g)].map(m=>m[0]);

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
    documentElement: {style: {}},
    querySelector(sel) { if (nodes.has(sel)) return nodes.get(sel); if(sel === '[data-complete]') return dynamic.complete || null; if(sel === '.sidebar-note') return main.innerHTML.includes('sidebar-note') ? dynamic.sidebar : null; return null; },
    querySelectorAll(sel) { if(sel === '.lesson-sidebar .sidebar-link') return (dynamic.links || []).filter(e => e.classList.contains('sidebar-link')); return []; },
    addEventListener: (name,fn) => handlers[name] = fn,
    getElementById: () => null,
    createElement: () => new Element()
  };
  const scrolls = [];
  const window = {scrollY:0, scrollTo() { scrolls.push(document.documentElement.style.scrollBehavior); }, addEventListener: (name,fn) => windowHandlers[name] = fn};
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
    sidebar: () => dynamic.sidebar.innerHTML,
    scrolls,
    rootScrollBehavior: () => document.documentElement.style.scrollBehavior
  };
}

const tests = [];
function test(name, fn) { tests.push([name,fn]); }
test('Legacy progress through twenty-two lessons survive thirty-lesson upgrade and resume at the next unfinished lesson', () => {
  // expected = first lesson in ORDER after the most recently completed one that is not yet completed
  for (const [saved,expected] of [[{completed:['chat','work'],last:'work'},'redirect'], [{completed:['chat','work','privacy','prompt'],last:'privacy'},'followup'], [{completed:['choose','setup','prompt','privacy','chat','files','search','projects','work','codex'],last:'projects'},'plan'], [{completed:['choose','setup','prompt','privacy','chat','files','search','projects','work','compare','documents','review','codex'],last:'review'},'plan'], [{completed:['choose','setup','prompt','privacy','chat','files','search','projects','work','compare','documents','review','codex','plan','debug','publish'],last:'publish'},'followup'], [{completed:['choose','setup','prompt','privacy','chat','files','search','projects','work','compare','documents','review','codex','workspace','folders','plan','run','debug','publish'],last:'run'},'followup'], [{completed:['choose','setup','prompt','privacy','chat','files','search','projects','work','compare','documents','review','codex','workspace','folders','plan','run','modify','debug','changes','backup','publish'],last:'backup'},'followup']]) {
    const app=setup(saved);
    const banner=app.html().match(/<section class="progress-banner"[\s\S]*?<\/section>/);
    assert.ok(banner,'Home shows the progress banner for returning learners');
    assert.ok(banner[0].includes(saved.completed.length+'/30 완료'));
    assert.ok(banner[0].includes('href="#/lesson/'+expected+'"'),'Banner recommends '+expected+' for '+JSON.stringify(saved));
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
test('Learning map exposes exactly thirty usable lessons and no prepared topics', () => {
  const app=setup(undefined,'#/courses');
  assert.equal((app.html().match(/class="course-row published[^"]*"/g)||[]).length,30);
  assert.equal((app.html().match(/class="course-row planned"/g)||[]).length,0);
  for(const key of ['choose','setup','prompt','privacy','chat','followup','clues','files','images','search','projects','teaching','work','environment','brief','compare','documents','redirect','review','reuse','codex','workspace','folders','plan','run','modify','debug','changes','backup','publish']) assert.ok(app.html().includes('href="#/lesson/'+key+'"'));
  const rows=rowsOf(app.html(),'chat');
  assert.equal(rows.length,8);
  rows.forEach((row,i)=> assert.ok(row.includes('href="#/lesson/'+ORDER.chat[i]+'"'),'chat row '+i+' is '+ORDER.chat[i]));
});
test('New completion persists through restart, cancellation persists, old completions remain', async () => {
  let app=setup({completed:['chat','work','privacy','prompt'],last:'privacy'},'#/lesson/reuse');
  const button=await app.complete();
  assert.equal(button.getAttribute('aria-pressed'),'true');
  assert.deepEqual(app.saved(),{completed:['chat','work','privacy','prompt','reuse'],last:'reuse'});
  app=setup(app.saved(),'#/lesson/reuse');
  assert.match(app.html(),/전체 학습 5\/30 완료/);
  assert.match(app.html(),/✓ 학습 완료 · 취소/);
  await app.complete();
  app=setup(app.saved());
  assert.deepEqual(app.saved().completed,['chat','work','privacy','prompt']);
  assert.match(app.html(),/4\/30 완료/);
});
test('Every new title and a text-only body fragment are searchable', () => {
  const app=setup();
  for(const key of ['choose','setup','prompt','privacy','files','search','projects','compare','documents','review','plan','debug','publish','workspace','folders','run','modify','changes','backup','followup','clues','images','teaching','environment','brief','redirect','reuse']) {
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
  assert.match(app.sidebar(),/전체 학습 2\/30 완료/);
  const button=await app.complete();
  assert.equal(button.getAttribute('aria-pressed'),'false');
  assert.deepEqual(app.saved().completed,['chat']);
});
test('Unknown and duplicate legacy completion entries cannot inflate progress', () => {
  const app=setup({completed:['chat','chat','removed','privacy'],last:'removed'});
  app.route('#/lesson/setup');
  assert.match(app.html(),/전체 학습 2\/30 완료/);
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
test('Practice lessons render with correct links from Chat through Work and the full Codex practice sequence', () => {
  const app=setup();
  const sequence=['privacy',...ORDER.chat,...ORDER.work,...ORDER.codex];
  sequence.slice(1).forEach((key,i)=> {
    app.route('#/lesson/'+key);
    assert.ok(app.html().includes(app.lessons[key].title));
    assert.doesNotMatch(app.html(),/undefined|이 페이지는 찾을 수 없어요/);
    const nav=app.html().match(/<nav class="lesson-nav"[\s\S]*?<\/nav>/)[0];
    assert.ok(nav.includes('href="#/lesson/'+sequence[i]+'"'));
    assert.ok(nav.includes('href="'+(sequence[i+2] ? '#/lesson/'+sequence[i+2] : '#/courses')+'"'));
  });
});
test('Work learning map publishes all eight lessons', () => {
  const app=setup(undefined,'#/courses');
  const rows=rowsOf(app.html(),'work');
  assert.equal(rows.length,8);
  rows.forEach((row,i)=> assert.ok(row.includes('href="#/lesson/'+ORDER.work[i]+'"'),'work row '+i+' is '+ORDER.work[i]));
});
test('Codex map includes preparation and practice in their correct positions', () => {
  const app=setup(undefined,'#/courses');
  const rows=rowsOf(app.html(),'codex');
  assert.equal(rows.length,10);
  rows.forEach((row,i)=> assert.ok(row.includes('href="#/lesson/'+ORDER.codex[i]+'"'),'codex row '+i+' is '+ORDER.codex[i]));
});
test('Home lists only the foundations and three path cards, not the thirty-lesson catalogue', () => {
  const app=setup();
  assert.equal((app.html().match(/class="course-row published/g)||[]).length,4,'only the four foundations are listed on home');
  assert.doesNotMatch(app.html(),/실전 3편|채팅 4편|Work 4편|준비 3편|복원 3편/);
  const cards=app.html().match(/<div class="path-grid">[\s\S]*?<\/div>\s*<div class="start-strip"/)[0];
  assert.ok(cards.includes('href="#/lesson/chat"'),'chat card starts at the first chat lesson');
  assert.ok(cards.includes('href="#/lesson/environment"'),'work card starts at the first work lesson');
  assert.ok(cards.includes('href="#/lesson/workspace"'),'codex card starts at the first codex lesson');
  assert.doesNotMatch(cards,/href="#\/lesson\/(work|codex)"/,'cards no longer jump into the middle of a path');
  assert.ok(cards.includes(app.lessons.environment.title));
  assert.ok(cards.includes('8편') && cards.includes('10편'));
});
test('Start page keeps the first-day route without repeating the thirty-lesson catalogue', () => {
  const app=setup(undefined,'#/start');
  assert.equal((app.html().match(/class="course-row published/g)||[]).length,4);
  assert.doesNotMatch(app.html(),/실전 3편|채팅 4편|Work 4편|준비 3편|복원 3편/);
  assert.ok(app.html().includes('href="#/lesson/chat"'));
  assert.ok(app.html().includes('href="#/lesson/environment"') && app.html().includes('href="#/lesson/workspace"'),'wider paths start at their first lesson');
});
test('Learning map marks completed lessons, shows minutes and highlights the next recommendation', () => {
  const app=setup({completed:['chat'],last:'chat'},'#/courses');
  const rows=Object.fromEntries(ALL.map(key=>[key,app.html().match(new RegExp('<a\\b[^>]*href="#/lesson/'+key+'"[^>]*>[\\s\\S]*?<\\/a>'))[0]]));
  assert.match(rows.chat,/✓ 완료/);
  assert.match(rows.followup,/다음 추천/);
  assert.match(rows.files,/약 12분/);
  assert.doesNotMatch(rows.files,/✓ 완료|다음 추천/);
  assert.equal((app.html().match(/다음 추천 →/g)||[]).length,1,'exactly one row carries the next-recommendation badge');
});
test('Home banner recommends the next unfinished lesson and handles first-time and finished learners', () => {
  assert.doesNotMatch(setup().html(),/progress-banner/,'first visit shows no banner');
  let app=setup({completed:[],last:'files'});
  assert.match(app.html(),/progress-banner[\s\S]*?href="#\/lesson\/files"/,'no completion yet: continue the last opened lesson');
  app=setup({completed:['chat'],last:'publish'});
  const banner=app.html().match(/<section class="progress-banner"[\s\S]*?<\/section>/)[0];
  assert.ok(banner.includes('href="#/lesson/followup"'),'recommends the lesson after the last completed one, not the last opened page');
  assert.ok(banner.includes('href="#/lesson/publish"'),'still offers the last opened lesson as a secondary link');
  app=setup({completed:ALL,last:'publish'});
  assert.match(app.html(),/progress-banner[\s\S]*?30\/30 완료[\s\S]*?href="#\/courses"/);
  assert.doesNotMatch(app.html().match(/<section class="progress-banner"[\s\S]*?<\/section>/)[0],/href="#\/lesson\//,'nothing left to recommend');
});
test('Lesson meta shows the position within its path instead of a generic badge', () => {
  const app=setup();
  for(const [key,label] of [['files','ChatGPT 채팅 3/8'],['work','ChatGPT Work 3/8'],['choose','공통 입문 1/4'],['publish','Codex 10/10'],['workspace','Codex 1/10']]) {
    app.route('#/lesson/'+key);
    const meta=app.html().match(/<div class="lesson-meta">[\s\S]*?<\/div>/)[0];
    assert.ok(meta.includes(label),key+' meta shows '+label+' but was '+meta);
    assert.doesNotMatch(meta,/초보 필수|첫 프로젝트/);
  }
});
test('Route change scrolls to the top instantly and restores smooth behaviour afterwards', () => {
  const app=setup();
  app.scrolls.length=0;
  app.route('#/lesson/chat');
  assert.deepEqual(app.scrolls,['auto'],'scrollTo runs while smooth scrolling is disabled');
  assert.equal(app.rootScrollBehavior(),'','smooth scrolling is restored for in-page section links');
});
test('Lesson file links open in a new tab so the guide stays open', () => {
  const app=setup();
  let checked=0;
  for(const key of ALL) {
    app.route('#/lesson/'+key);
    for(const anchor of app.html().matchAll(/<a\b[^>]*href="\.\/[^"]*"[^>]*>/g)) { checked++; assert.match(anchor[0],/target="_blank"/,key+' link '+anchor[0]); assert.match(anchor[0],/rel="noopener/,key+' link '+anchor[0]); }
    for(const anchor of app.html().matchAll(/<a\b[^>]*href="#\/[^"]*"[^>]*>/g)) assert.doesNotMatch(anchor[0],/target="_blank"/,key+' internal link must stay in this tab');
  }
  assert.ok(checked>=20,'file links were actually inspected: '+checked);
});
test('Lesson navigation renders previous and next as labelled buttons', () => {
  const app=setup();
  app.route('#/lesson/files');
  const nav=app.html().match(/<nav class="lesson-nav"[\s\S]*?<\/nav>/)[0];
  assert.match(nav,/<a class="nav-button prev" href="#\/lesson\/followup"><small>이전<\/small><span>후속 요청<\/span><\/a>/);
  assert.match(nav,/<a class="nav-button next" href="#\/lesson\/clues"><small>다음<\/small><span>요청의 네 단서<\/span><\/a>/);
});
test('Sidebar groups the thirty lessons by path in the unified order', () => {
  const app=setup();
  app.route('#/lesson/files');
  const sidebar=app.html().match(/<aside class="lesson-sidebar">[\s\S]*?<\/aside>/)[0];
  assert.deepEqual([...sidebar.matchAll(/<p class="sidebar-group">([^<]*)<\/p>/g)].map(m=>m[1]),['공통 입문','ChatGPT 채팅','ChatGPT Work','Codex']);
  assert.deepEqual([...sidebar.matchAll(/href="#\/lesson\/([a-z]+)"/g)].map(m=>m[1]),ALL,'sidebar follows the unified order');
});
test('Search understands the words beginners actually type', () => {
  const app=setup();
  for(const [query,expected] of [['코덱스','#/lesson/codex'],['코덱스','#/lesson/workspace'],['프롬프트','#/lesson/prompt'],['프롬프트','#/lesson/clues'],['챗지피티 파일','#/lesson/files'],['업로드','#/lesson/files'],['워크','#/lesson/environment'],['회원가입','#/help?faq=signup'],['에러','#/lesson/debug']]) {
    assert.ok(app.search(query).includes('href="'+expected+'"'),'"'+query+'" should find '+expected);
  }
  assert.match(app.search('존재하지않는검색어xyz'),/맞는 결과가 없어요/);
  const firstHits=q=>[...app.search(q).matchAll(/href="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(firstHits('코덱스')[0],'#/lesson/workspace','path matches rank above lessons that merely mention Codex');
  assert.equal(firstHits('워크')[0],'#/lesson/environment');
  assert.equal(firstHits('파일 질문')[0],'#/lesson/files','title matches rank above body matches');
});
test('Help page adds signup and install FAQs, a permission rule table and a glossary', () => {
  const app=setup(undefined,'#/help');
  const html=app.html();
  assert.ok(html.includes('id="faq-signup"') && html.includes('id="faq-codex-install"'));
  const permissions=html.match(/<details class="faq" id="faq-permissions">[\s\S]*?<\/details>/)[0];
  assert.match(permissions,/허용해도 되는 요청/);
  assert.match(permissions,/멈추고 확인할 요청/);
  const glossary=html.match(/<section id="glossary"[\s\S]*?<\/section>/);
  assert.ok(glossary,'glossary section exists');
  for(const term of ['로컬','경로','확장자','첨부','요청문','권한 승인','브라우저 저장 공간','배포','저장소','브랜치','시크릿 모드','API 키']) assert.ok(glossary[0].includes('<dt>'+term),'glossary defines '+term);
  assert.ok(app.search('브랜치').includes('href="#/help?section=glossary"'),'glossary terms are searchable');
});
test('Resources page leads with the two starter files and groups the rest by path', () => {
  const app=setup(undefined,'#/resources');
  const html=app.html();
  const starter=html.match(/<section class="starter-files"[\s\S]*?<\/section>/);
  assert.ok(starter,'starter box exists');
  assert.ok(starter[0].includes(encodeURIComponent('2026-09-20-공개수업-계획.txt')) && starter[0].includes(encodeURIComponent('2026-09-20-공개수업-메모.txt')));
  const at=name=>html.indexOf(encodeURIComponent(name));
  assert.ok(at('2026-09-20-공개수업-계획.txt')<at('2026-09-22-채팅활용-기록표.md'),'chat sheet after starters');
  assert.ok(at('2026-09-22-채팅활용-기록표.md')<at('2026-09-21-탐구준비물-비교자료.csv'),'work files after chat files');
  assert.ok(at('2026-09-21-탐구준비물-비교자료.csv')<at('2026-09-21-Codex-준비점검표.md'),'codex files after work files');
  assert.deepEqual([...html.matchAll(/<h2 class="resource-group">([^<]*)<\/h2>/g)].map(m=>m[1]),['ChatGPT 채팅','ChatGPT Work','Codex','공통']);
  assert.equal((html.match(/class="resource-grid"/g)||[]).length,1,'single grid so the practice lab still attaches after it');
});
test('Prompt boxes use a step-specific label when the prompt is not a chat message', () => {
  const app=setup();
  app.lessons.chat.steps[1].promptLabel='프로젝트 지침 칸에 붙여 넣기';
  app.route('#/lesson/chat');
  assert.ok(app.html().includes('<span>프로젝트 지침 칸에 붙여 넣기</span>'));
  assert.ok(app.html().includes('<span>이렇게 말해보세요</span>'),'other prompts keep the default label');
  delete app.lessons.chat.steps[1].promptLabel;
});
test('Published entrypoint loads new lesson script before guide and rendered local downloads exist', () => {
  const workflow=fs.readFileSync(path.join(__dirname,'.github/workflows/2026-09-20-pages.yml'),'utf8');
  assert.match(workflow,/cp 2026-09-20-guide\.html _site\/index\.html/);
  assert.match(workflow,/cp [^\n]*2026-09-21-chat-practice\.js[^\n]* _site\//);
  assert.match(workflow,/cp [^\n]*2026-09-21-work-practice\.js[^\n]* _site\//);
  assert.match(workflow,/cp [^\n]*2026-09-21-codex-practice\.js[^\n]* _site\//);
  for(const entry of ['2026-09-20-guide.html']) {
    const html=fs.readFileSync(path.join(__dirname,entry),'utf8');
    const scripts=[...html.matchAll(/<script\b[^>]*src="([^"?]+)(?:\?[^\"]*)?"/g)].map(m=>m[1].replace(/^\.\//,''));
    assert.deepEqual(scripts.filter(script=>files.includes(script)),files,entry+' uses same application script load order as VM checks');
  }
  const app=setup();
  app.route('#/resources');
  const copiedFiles=workflow.split('\n').map(line=>line.trim()).filter(line=>/^cp .+ _site\/$/.test(line)).flatMap(line=>line.split(/\s+/).slice(1,-1));
  for(const resource of ['2026-09-21-탐구준비물-비교자료.csv','2026-09-21-공개수업-검토용초안.txt','2026-09-21-Work-결과검토표.md','2026-09-21-Codex-실습기록표.md','2026-09-21-Codex-준비점검표.md','2026-09-21-Codex-수정복원기록표.md','2026-09-22-채팅활용-기록표.md','2026-09-22-사진질문-연습화면.html','2026-09-22-Work-작업설계표.md']) {
    assert.ok(copiedFiles.includes(resource),'Workflow publishes '+resource);
    assert.ok(app.html().includes('href="./'+encodeURIComponent(resource)+'"'),'Resource page links '+resource);
    assert.ok(fs.existsSync(path.join(__dirname,resource)),'Resource file exists '+resource);
  }
  for(const route of ['#/resources','#/lesson/files','#/lesson/search','#/lesson/projects','#/lesson/compare','#/lesson/documents','#/lesson/review','#/lesson/plan','#/lesson/debug','#/lesson/publish','#/lesson/workspace','#/lesson/folders','#/lesson/run','#/lesson/modify','#/lesson/changes','#/lesson/backup','#/lesson/followup','#/lesson/clues','#/lesson/images','#/lesson/teaching','#/lesson/environment','#/lesson/brief','#/lesson/redirect','#/lesson/reuse']) {
    app.route(route);
    for(const match of app.html().matchAll(/href="(\.\/[^"#?]+)"/g)) {
      const filename=decodeURIComponent(match[1]);
      assert.ok(fs.existsSync(path.join(__dirname,filename)),route+' linked file '+filename);
    }
  }
});
(async () => {
  let failed=0;
  for (const [name,fn] of tests) {
    try { await fn(); console.log('PASS '+name); }
    catch (error) { failed++; console.log('FAIL '+name+'\n  '+String(error.message||error).split('\n').join('\n  ')); }
  }
  if (failed) { console.log(`\n${failed} of ${tests.length} application behavior checks failed.`); process.exitCode=1; }
  else console.log(`\n${tests.length} application behavior checks passed. DOM/storage mocked; browser verification remains separate.`);
})().catch(error => { console.error(error); process.exitCode=1; });
