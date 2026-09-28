/* Course integrity and beginner-facing boundaries. Real accounts/deployments are checked separately. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const base=__dirname;
const source=fs.readFileSync(path.join(base,'2026-09-28-service-lessons.js'),'utf8');
const window={GUIDE_LESSONS:{}};
vm.runInNewContext(source,{window});
const course=window.GUIDE_SERVICE;
const lessons=window.GUIDE_LESSONS;
const tests=[];
const test=(name,fn)=>tests.push([name,fn]);
test('Seven chapters contain twenty distinct complete lessons',()=>{
 assert.equal(course.chapters.length,7);
 const keys=course.chapters.flatMap(g=>g.keys);
 assert.equal(keys.length,20);assert.equal(new Set(keys).size,20);
 assert.deepEqual(Object.keys(lessons),Array.from(keys));
 for(const key of keys){const l=lessons[key];
  for(const field of ['title','summary','outcome','tip'])assert.ok(l[field]?.length>8,key+' '+field);
  assert.equal(l.checkedDate,'2026-09-28');assert.ok(l.minutes>0);
  assert.ok(l.prerequisites.length>=2 && l.steps.length>=3 && l.checks.length>=3 && l.troubleshooting.length>=2 && l.sources.length>=1,key);
  assert.ok(l.steps.some(s=>s.prompt),key+' copyable practice');
  assert.ok(l.sources.every(s=>/^https:\/\//.test(s.url)),key+' sources');
 }
});
test('Local storage and code history do not imply device synchronization',()=>{
 assert.match(JSON.stringify(lessons.git),/브라우저/);
 assert.match(JSON.stringify(lessons.localdata),/다른.*기기|휴대폰/);
 assert.match(JSON.stringify(lessons.localdata),/file:|파일 주소/);
 assert.match(JSON.stringify(lessons.datatransfer),/복원.*취소|취소.*복원/);
});
test('In-memory CRUD is labeled temporary and not real persistent database verification',()=>{
 assert.match(JSON.stringify(lessons.crud),/메모리/);
 assert.match(JSON.stringify(lessons.crud),/재시작/);
 assert.match(JSON.stringify(lessons.crud),/PostgreSQL/);
});
test('Server authorization precedes public deployment and rejects direct API misuse',()=>{
 const keys=course.chapters.flatMap(g=>g.keys);
 assert.ok(keys.indexOf('permissions')<keys.indexOf('railway'));
 assert.match(JSON.stringify(lessons.permissions),/서버/);
 assert.match(JSON.stringify(lessons.permissions),/401/);
 assert.match(JSON.stringify(lessons.permissions),/403/);
 assert.match(JSON.stringify(lessons.permissions),/다른.*계정/);
});
test('Secrets stay server-side; public Firebase config has a separate explanation',()=>{
 const text=JSON.stringify(lessons.envvars);
 assert.match(text,/DATABASE_URL/);assert.match(text,/비공개|서버에만/);
 assert.match(text,/Firebase/);assert.match(text,/공개/);
 assert.match(text,/교체|폐기/);
});
test('Railway costs, restart persistence and recovery remain distinct checks',()=>{
 assert.match(JSON.stringify(lessons.railway),/Hard limit/);
 assert.match(JSON.stringify(lessons.railway),/알림/);
 assert.match(JSON.stringify(lessons.postgres),/재시작/);
 assert.match(JSON.stringify(lessons.postgres),/비공개|private/);
 assert.match(JSON.stringify(lessons.operations),/복원/);
});
test('Real-time success uses two devices with reconnect and concurrency verification',()=>{
 assert.match(JSON.stringify(lessons.realtime),/휴대폰/);
 assert.match(JSON.stringify(lessons.realtime),/새로고침/);
 assert.match(JSON.stringify(lessons.syncerrors),/동시/);
 assert.match(JSON.stringify(lessons.syncerrors),/재연결|다시 연결/);
});
test('Entry point and deployment publish the entire extension',()=>{
 const html=fs.readFileSync(path.join(base,'2026-09-20-guide.html'),'utf8');
 const workflow=fs.readFileSync(path.join(base,'.github/workflows/2026-09-20-pages.yml'),'utf8');
 assert.ok(html.indexOf('2026-09-28-service-lessons.js')<html.indexOf('2026-09-20-guide.js'));
 assert.match(html,/2026-09-28-service\.css/);
 for(const file of ['2026-09-28-service-lessons.js','2026-09-28-service.css','2026-09-28-서비스확장-실습기록표.md','2026-09-28-서비스확장-강사안내.md']){
  assert.ok(fs.existsSync(path.join(base,file)),file);assert.ok(workflow.includes(file),file+' published');
 }
 assert.ok(workflow.includes('node 2026-09-28-service-checks.cjs'));
});
test('Every local practice link resolves and every lesson link targets existing curriculum',()=>{
 const existing={GUIDE_LESSONS:{}};
 const html=fs.readFileSync(path.join(base,'2026-09-20-guide.html'),'utf8');
 for(const m of html.matchAll(/<script[^>]+src="\.\/([^"]+)"/g)){
  if(m[1].endsWith('guide.js')||m[1].endsWith('screen-guides.js'))continue;
  vm.runInNewContext(fs.readFileSync(path.join(base,m[1]),'utf8'),{window:existing});
 }
 for(const l of Object.values(lessons))for(const step of l.steps)for(const link of step.links||[]){
  if(link.url.startsWith('./'))assert.ok(fs.existsSync(path.join(base,decodeURIComponent(link.url))),link.url);
  if(link.url.startsWith('#/lesson/'))assert.ok(existing.GUIDE_LESSONS[link.url.split('/')[2].split('?')[0]],link.url);
 }
});
let failed=0;for(const [name,fn] of tests){try{fn();console.log('PASS '+name);}catch(e){failed++;console.log('FAIL '+name+'\n  '+e.message);}}
console.log(`${tests.length-failed}/${tests.length} extension checks passed. No live account or cloud deployment is exercised.`);
if(failed)process.exitCode=1;
