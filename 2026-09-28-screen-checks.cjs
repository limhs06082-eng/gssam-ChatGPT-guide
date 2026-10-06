/* Real capture metadata and rendered markup checks. Visual/privacy review remains separate. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'2026-09-20-screen-guides.js'),'utf8');
function setup(key){
 let html='';
 const prepared={insertAdjacentHTML:(_position,value)=>{html=value;}};
 const image={addEventListener(){},complete:false};
 const main={querySelector(selector){return selector==='#prepare'?prepared:selector==='[data-screen-frame] img'?image:null;},querySelectorAll(){return [];}};
 const document={getElementById:()=>main,addEventListener(){}};
 const window={};
 vm.runInNewContext(source,{window,document,location:{hash:'#/lesson/'+key},MutationObserver:class{observe(){}},URLSearchParams,requestAnimationFrame(){}});
 return {screens:window.GUIDE_SCREENS,html};
}
const tests=[
 ['Verified web screens preserve attachment evidence and add the captured settings',()=>{
  const {screens}=setup('setup');
  for(const key of ['setup','chat','files','environment','work']){
   assert.ok(screens[key],key+' capture exists');
   assert.match(screens[key].image,/^\.\/2026-09-28-.*\.png$/);
   assert.match(screens[key].caption,/2026-09-28/);
  }
  assert.notEqual(screens.chat.image,screens.work.image);
  assert.match(screens.work.alt,/결과 카드/,'Work shows generated results, not the Chat start image');
  assert.match(screens.work.caption,/실제로 첨부/,'the current Work capture follows the verified attachment path');
  assert.doesNotMatch(screens.work.warning,/본문을 붙여 넣은 대체/,'the current capture is not the earlier fallback rehearsal');
  for(const key of ['projects','login','railway']){
   const s=screens[key];
   assert.ok(s,key+' capture exists');
   assert.equal(s.image,'./2026-10-06-화면-'+key+'.png');
   assert.equal(s.checkedDate,'2026-10-06');
   for(const field of ['alt','source','sourceLabel','caption','warning'])assert.ok(s[field],key+' '+field);
   assert.match(s.caption,/2026-10-06.*사용자 계정/,'do not claim an unverified dedicated account');
   assert.ok(s.caption.includes(s.source),key+' caption links its official feature guide');
   for(const p of s.points)assert.ok(p.x>=5&&p.x<=95&&p.y>=5&&p.y<=95,key+' avoids edge correction');
  }
  assert.match(screens.projects.warning,/Sources.*미완료/,'partial project evidence is labelled');
  assert.match(screens.login.warning,/저장.*취소/,'viewing settings does not claim enabling login');
  assert.match(screens.railway.warning,/기존.*새 배포/,'existing deployments do not imply a new deployment');
  assert.equal(screens.run,undefined,'blocked file URL capture has no substitute');
  assert.equal(screens.postgres,undefined,'missing PostgreSQL service has no substitute');
 }],
 ['Local PNGs have matching dimensions, valid hotspots and deployable sizes',()=>{
  const {screens}=setup('setup');
  let count=0;
  for(const [key,s] of Object.entries(screens).filter(([,s])=>s.image.startsWith('./'))){
   count++;
   const bytes=fs.readFileSync(path.join(__dirname,s.image));
   assert.equal(bytes.toString('ascii',1,4),'PNG',key+' PNG signature');
   assert.equal(bytes.readUInt32BE(16),s.width,key+' width');
   assert.equal(bytes.readUInt32BE(20),s.height,key+' height');
   assert.ok(s.width<=1600&&bytes.length<=300*1024,key+' capture size');
   assert.ok(s.points.length>0);
   for(const p of s.points)assert.ok(p.x>0&&p.x<100&&p.y>0&&p.y<100,key+' hotspot range');
  }
  assert.equal(count,8,'the eight verified web captures are published');
  const usage=fs.readFileSync(path.join(__dirname,'2026-10-06-화면-railway-usage.png'));
  assert.equal(usage.toString('ascii',1,4),'PNG');
  assert.ok(usage.readUInt32BE(16)<=1600&&usage.length<=300*1024,'supplementary Usage capture size');
 }],
 ['The attachment tour names both files and separates uploading from reading',()=>{
  const {screens,html}=setup('files');
  assert.ok(screens.files,'attachment capture exists');
  const explanations=screens.files.points.map(p=>p.text).join(' ');
  assert.ok(explanations.includes('2026-09-20-공개수업-계획.txt'));
  assert.ok(explanations.includes('2026-09-20-공개수업-메모.txt'));
  assert.match(screens.files.warning,/생략/,'long names can be truncated in the real UI');
  assert.match(screens.files.warning,/읽/,'file visibility does not prove reading');
  assert.ok(html.includes('aspect-ratio:'+screens.files.width+'/'+screens.files.height));
 }],
 ['Local hotspots remain separate on the 300px frame used at mobile width',()=>{
  const {screens}=setup('work');
  for(const [key,s] of Object.entries(screens).filter(([,s])=>s.image.startsWith('./'))){
   const height=300*s.height/s.width;
   const centers=s.points.map(p=>[Math.max(20,Math.min(280,p.x*3)),Math.max(20,Math.min(height-20,p.y*height/100))]);
   for(let i=0;i<centers.length;i++)for(let j=i+1;j<centers.length;j++){
    assert.ok(Math.hypot(centers[i][0]-centers[j][0],centers[i][1]-centers[j][1])>=36,key+' hotspot '+(i+1)+' and '+(j+1)+' do not overlap');
   }
  }
 }],
 ['The rendered frame follows each local image ratio and labels captured screens honestly',()=>{
  const {screens,html}=setup('setup');
  assert.ok(screens.setup,'setup capture exists');
  assert.ok(html.includes('aspect-ratio:'+screens.setup.width+'/'+screens.setup.height),'frame aspect ratio matches image');
  assert.match(html,/画面|화면 크게 보기/);
  assert.doesNotMatch(html,/공식 화면 크게 보기|영어 메뉴 이름과 함께/);
  assert.match(html,/2026-09-28 확인/);
 }],
 ['Every local capture is explicitly listed in the Pages publish files',()=>{
  const {screens}=setup('setup');
  const workflow=fs.readFileSync(path.join(__dirname,'.github/workflows/2026-09-20-pages.yml'),'utf8');
  const copied=workflow.split('\n').map(l=>l.trim()).filter(l=>/^cp .+ _site\/$/.test(l)).flatMap(l=>l.split(/\s+/).slice(1,-1));
  for(const [key,s] of Object.entries(screens).filter(([,s])=>s.image.startsWith('./')))assert.ok(copied.includes(s.image.slice(2)),key+' is published');
  assert.ok(Object.values(screens).some(s=>s.image.startsWith('./')),'there are local captures');
  assert.ok(copied.includes('2026-10-06-화면-railway-usage.png'),'Usage menu is published');
 }]
];
let failed=0;
for(const [name,test] of tests){try{test();console.log('PASS '+name);}catch(error){failed++;console.log('FAIL '+name+'\n  '+error.message);}}
console.log('\n'+(tests.length-failed)+'/'+tests.length+' capture checks passed. Layout and privacy are inspected in the browser separately.');
if(failed)process.exitCode=1;
