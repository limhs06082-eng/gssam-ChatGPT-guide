'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const path=require('node:path');
const window={};
for(const file of ['2026-09-20-lessons.js','2026-09-20-foundations.js','2026-09-21-chat-practice.js','2026-09-21-work-practice.js','2026-09-22-work-completion.js','2026-09-21-codex-basics.js','2026-09-28-service-lessons.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,file),'utf8'),{window});
const lessons=window.GUIDE_LESSONS;
const tests=[
 ['Chat and captured settings use observed controls and distinguish incomplete evidence',()=>{
  assert.match(lessons.chat.steps[0].text,/새 채팅/);
  assert.match(lessons.chat.steps[0].text,/Chat.*선택/);
  assert.match(lessons.projects.steps[0].text,/프로젝트 선택.*새 프로젝트.*프로젝트 만들기/);
  assert.match(lessons.projects.steps[2].text,/프로젝트 액션.*프로젝트 설정.*지침.*저장/);
  assert.match(lessons.projects.steps[1].text,/라이브러리/);
  assert.match(lessons.login.steps[1].text,/로그인 방법.*새 제공업체 추가.*Google.*사용 설정/);
  assert.equal(lessons.login.checkedDate,'2026-10-06');
  assert.match(lessons.railway.steps[0].text,/Usage/);
  assert.ok(lessons.railway.steps[0].links.some(l=>l.url==='./2026-10-06-화면-railway-usage.png'));
 }],
 ['The file attachment step names the verified menu and checks both filenames',()=>{
  assert.match(lessons.files.steps[1].text,/사진 및 파일 추가/);
  assert.match(lessons.files.steps[1].text,/이름.*두|두.*이름/);
 }],
 ['Windows setup describes the official Store link without an invented anchor label',()=>{
  assert.doesNotMatch(lessons.workspace.steps[1].text,/Download the ChatGPT desktop app for Windows/);
  assert.match(lessons.workspace.steps[1].text,/Microsoft Store/);
  assert.match(lessons.workspace.steps[1].links[0].url,/\/docs\/windows\/windows-app$/);
 }],
 ['Work instructions use the observed start controls instead of an unverified new-task button',()=>{
  for(const key of ['environment','work','compare','documents','review']){
   assert.doesNotMatch(lessons[key].steps.map(s=>s.text).join(' '),/→ 새 작업 →/);
  }
  assert.match(lessons.environment.steps[0].text,/Work/);
 }],
 ['Work keeps a clearly separated text fallback for attachment failures',()=>{
  assert.ok(lessons.work.troubleshooting.some(t=>/첨부할 수/.test(t.question)&&/본문/.test(t.answer)&&/파일.*읽/.test(t.answer)));
  assert.ok(lessons.work.steps[2].links?.some(l=>l.url==='#/lesson/files?section=step-2'),'fallback link belongs to the rendered step');
  assert.ok(!lessons.work.troubleshooting.find(t=>/첨부할 수/.test(t.question)).answer.includes('첨부한 두 파일'),'replacement instructions match the real request text');
 }]
];
let failed=0;
for(const [name,test] of tests){try{test();console.log('PASS '+name);}catch(e){failed++;console.log('FAIL '+name+'\n  '+e.message);}}
console.log('\n'+(tests.length-failed)+'/'+tests.length+' UI content checks passed. These checks do not replace real UI rehearsals.');
if(failed)process.exitCode=1;
