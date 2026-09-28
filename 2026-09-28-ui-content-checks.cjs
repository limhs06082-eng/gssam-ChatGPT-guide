'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const path=require('node:path');
const window={};
for(const file of ['2026-09-20-lessons.js','2026-09-20-foundations.js','2026-09-21-chat-practice.js','2026-09-21-work-practice.js','2026-09-22-work-completion.js','2026-09-21-codex-basics.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,file),'utf8'),{window});
const lessons=window.GUIDE_LESSONS;
const tests=[
 ['A new chat explicitly selects Chat because the previous mode can persist',()=>{
  assert.match(lessons.chat.steps[0].text,/새 채팅/);
  assert.match(lessons.chat.steps[0].text,/Chat.*선택/);
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
