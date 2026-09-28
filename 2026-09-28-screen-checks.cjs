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
 ['Four verified web screens use local real captures with distinct Chat and Work images',()=>{
  const {screens}=setup('setup');
  for(const key of ['setup','chat','environment','work']){
   assert.ok(screens[key],key+' capture exists');
   assert.match(screens[key].image,/^\.\/2026-09-28-.*\.png$/);
   assert.match(screens[key].caption,/2026-09-28/);
  }
  assert.notEqual(screens.chat.image,screens.work.image);
  assert.match(screens.work.alt,/결과 카드/,'Work shows generated results, not the Chat start image');
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
  assert.equal(count,4,'only the four currently verified web captures are published');
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
 }]
];
let failed=0;
for(const [name,test] of tests){try{test();console.log('PASS '+name);}catch(error){failed++;console.log('FAIL '+name+'\n  '+error.message);}}
console.log('\n'+(tests.length-failed)+'/'+tests.length+' capture checks passed. Layout and privacy are inspected in the browser separately.');
if(failed)process.exitCode=1;
