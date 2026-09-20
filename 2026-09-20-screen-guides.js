/* 공식 자료의 실제 화면 이미지 + 가이드 자체의 번호 설명. 모델/권한의 선택을 권장하는 그림이 아님. */
window.GUIDE_SCREENS = {
 chat: {
  image:'https://learn.chatgpt.com/images/codex/video-posters/chatgpt-work-select.webp',
  alt:'OpenAI 공식 예시 화면. 위에 Chat과 Work 선택, 아래에 추가 버튼과 요청 입력창이 있습니다.',
  source:'https://learn.chatgpt.com/docs/get-started-with-work',
  sourceLabel:'OpenAI · Work 시작 안내의 화면 예시',
  caption:'공식 영상의 시작 화면입니다. 번호 표시는 이 가이드에서 추가했습니다.',
  warning:'영문 예시에서는 Chat이라고 표시됩니다. 내 화면에서는 채팅 등 다른 언어로 표시될 수 있어요. 같은 버튼이 없다면 먼저 새 대화를 열고 일반 질문부터 시작하세요.',
  points:[
   {x:58,y:11,title:'Chat · 채팅을 찾아요',text:'새 대화 화면에서 Chat을 선택합니다. 이번에는 짧은 안내문을 대화하며 다듬을 거예요. Work를 먼저 켤 필요는 없습니다.'},
   {x:43,y:74,title:'입력창에 요청을 넣어요',text:'Ask ChatGPT라고 적힌 입력창을 눌러 아래 실습의 요청문을 붙여 넣으세요. Enter 또는 화면의 보내기 버튼으로 전송합니다.'},
   {x:24,y:76,title:'자료를 넣을 때는 추가 버튼',text:'입력창 옆 +는 자료를 추가할 때 찾는 버튼입니다. 오늘 채팅 실습은 가상 행사 정보를 글로 주므로 파일을 넣지 않아도 됩니다.'}
  ]
 },
 work: {
  image:'https://learn.chatgpt.com/images/codex/video-posters/chatgpt-work-select.webp',
  alt:'OpenAI 공식 예시의 Chat·Work 선택 화면. 위쪽 Work와 아래쪽 파일 추가·요청 입력창을 찾을 수 있습니다.',
  source:'https://learn.chatgpt.com/docs/get-started-with-work',
  sourceLabel:'OpenAI · Work 시작 안내의 화면 예시',
  caption:'공식 영상의 시작 화면이며 Chat이 선택된 상태입니다. 실제 실습에서는 Work를 선택합니다.',
  warning:'Work가 보이지 않으면 계정·앱·조직 설정을 확인해 주세요. 이 그림을 눌러도 실제 ChatGPT 설정은 바뀌지 않습니다. 실제 작업은 ChatGPT에서 진행합니다.',
  points:[
   {x:73,y:11,title:'Work · 작업을 맡기는 선택',text:'새 대화 상단의 Work를 선택하세요. 데스크톱 앱에서는 먼저 제품 선택에서 ChatGPT를 고른 뒤 Work로 전환하는 흐름을 공식 문서에서 안내합니다.'},
   {x:24,y:76,title:'실습 자료 두 개를 전달해요',text:'추가 버튼 또는 현재 환경의 첨부 기능으로 계획서와 준비 메모를 전달하세요. 두 파일을 실제로 읽을 수 있는지 확인하고 시작합니다.'},
   {x:43,y:74,title:'결과물과 조건을 적어요',text:'입력창에 대상·한 쪽 분량·필수 정보·확인할 항목을 함께 적습니다. Work가 진행 중 질문하면 자료를 기준으로 답하고, 결과 파일을 직접 열어 확인합니다.'}
  ]
 },
 codex: {
  image:'https://learn.chatgpt.com/images/codex/video-posters/proactive-teammate-v2.webp',
  alt:'OpenAI 공식 데스크톱 앱 예시. 가운데 작업 폴더 선택, 아래 요청 입력창, 입력창 왼쪽 권한 설정과 오른쪽 보내기 버튼이 있습니다.',
  source:'https://learn.chatgpt.com/docs/app',
  sourceLabel:'OpenAI · 데스크톱 앱 안내의 화면 예시',
  caption:'공식 문서에 수록된 Codex 예시 화면입니다. 영상 속 모델 이름·권한·메뉴는 현재 계정과 다를 수 있습니다.',
  warning:'그림의 work는 폴더 이름이며 ChatGPT Work 모드가 아닙니다. Full access는 영상 속 설정입니다. 따라 바꾸지 말고 현재 기본 권한에서 대상 폴더와 실행할 작업을 확인하세요.',
  points:[
   {x:51,y:31,title:'작업 폴더를 먼저 확인해요',text:'폴더 아이콘과 이름에서 현재 작업 위치를 확인합니다. 내 문서 전체가 아닌, 이번 실습을 위해 만든 빈 폴더를 선택하세요. 현재 공식 시작 안내에서는 제품 선택의 Codex로 진입합니다.'},
   {x:35,y:41,title:'첫 요청은 계획부터',text:'입력창에 만들 도구와 필요한 기능을 설명하세요. 아래 첫 요청문은 파일을 바로 만들지 않고 계획을 먼저 보여 달라는 내용입니다.'},
   {x:22,y:50,title:'허용할 작업을 읽고 결정해요',text:'권한 관련 선택이나 확인이 나오면 무엇을 읽거나 바꾸는지 확인합니다. 이해하기 어렵다면 쉬운 말로 설명해 달라고 요청하세요.'},
   {x:83,y:50,title:'보내고, 실행 결과까지 확인해요',text:'위쪽 화살표 모양의 보내기 버튼으로 요청합니다. 구현이 끝나면 안내받은 실행 주소를 열어 수업 카드와 활동 이동을 직접 확인하세요.'}
  ]
 }
};

(() => {
 'use strict';
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const main=document.getElementById('main');
 const sample='복사 연습 완료! 이제 내 수업에 맞게 바꿔 볼게요.';
 const getKey=()=>location.hash.split('?')[0].split('/')[2];
 function screenMarkup(key) {
  const s=window.GUIDE_SCREENS[key];
  return `<section class="screen-tour" id="screen-tour" aria-labelledby="screen-tour-title"><h2 id="screen-tour-title">화면에서 먼저 찾아보세요</h2><p class="screen-intro">번호를 누르면 해당 위치에서 할 일을 볼 수 있어요. 영어 메뉴 이름과 함께 확인해 보세요.</p><div class="screen-frame ${key}" data-screen-frame><img src="${s.image}" alt="${esc(s.alt)}" loading="lazy" referrerpolicy="no-referrer"><div class="screen-image-error" role="status">공식 화면 이미지를 불러오지 못했어요.<br>아래 번호 설명으로 계속 배우거나 공식 원문을 열어 보세요.</div>${s.points.map((p,i)=>`<button class="hotspot" style="--x:${p.x}%;--y:${p.y}%" data-tour-point="${i}" aria-label="${i+1}. ${esc(p.title)}" aria-pressed="${i===0}" aria-controls="screen-explanation">${i+1}</button>`).join('')}</div><div class="screen-caption"><p>${esc(s.caption)}</p><button class="button small" data-enlarge-screen>공식 화면 크게 보기 ↗</button></div><p class="screen-attribution">화면 출처: <a href="${s.source}" target="_blank" rel="noopener noreferrer">${s.sourceLabel} ↗</a> · 2026-09-20 확인</p><div class="screen-choices" role="group" aria-label="화면 안내 단계">${s.points.map((p,i)=>`<button data-tour-point="${i}" aria-pressed="${i===0}" aria-controls="screen-explanation">${i+1}. ${esc(p.title)}</button>`).join('')}</div><div class="screen-explanation" id="screen-explanation" aria-live="polite"><h3>${esc(s.points[0].title)}</h3><p>${esc(s.points[0].text)}</p></div><div class="screen-warning">${esc(s.warning)}</div></section>`;
 }
 function setupScreen(key) {
  const prepared=main.querySelector('#prepare');if(!prepared||main.querySelector('#screen-tour'))return;
  prepared.insertAdjacentHTML('afterend',screenMarkup(key));
  const image=main.querySelector('[data-screen-frame] img');
  const failed=()=>{const frame=image.closest('[data-screen-frame]');frame.classList.add('failed');main.querySelector('[data-enlarge-screen]').hidden=true;};
  image.addEventListener('error',failed);if(image.complete&&!image.naturalWidth)failed();
  const toc=main.querySelector('.lesson-toc');if(toc){const a=document.createElement('a');a.href=`#/lesson/${key}?section=screen-tour`;a.dataset.scroll='screen-tour';a.textContent='화면 먼저 살펴보기';toc.querySelector('a').after(a);}
  if(new URLSearchParams(location.hash.split('?')[1]||'').get('section')==='screen-tour')requestAnimationFrame(()=>main.querySelector('#screen-tour').scrollIntoView());
 }
 function setupCopyHelp() {
  main.querySelectorAll('.prompt-box').forEach((box,index)=>{
   if(box.querySelector('.copy-fallback'))return;
   const prompt=box.querySelector('pre').textContent;
   const help=document.createElement('details');help.className='copy-fallback';
   help.innerHTML=`<summary>복사가 안 되나요? 직접 선택해서 복사하기</summary><p>아래 ‘전체 선택’을 누르고 Ctrl+C로 복사하세요. 휴대폰에서는 글을 길게 눌러 선택할 수 있어요.</p><label class="sr-only" for="manual-prompt-${index}">직접 복사할 요청문 ${index+1}</label><textarea id="manual-prompt-${index}" readonly spellcheck="false">${esc(prompt)}</textarea><button data-select-prompt>요청문 전체 선택</button>`;
   box.append(help);
  });
 }
 function setupLab() {
  if(!location.hash.startsWith('#/resources')||main.querySelector('#practice-lab'))return;
  const grid=main.querySelector('.resource-grid');if(!grid)return;
  grid.insertAdjacentHTML('afterend',`<section id="practice-lab" aria-labelledby="practice-lab-title"><h2 id="practice-lab-title">실습 전에, 두 가지만 연습해요</h2><article class="lab-card"><h2>1. 복사하고 붙여 넣기</h2><p>짧은 문장을 복사한 뒤 아래 칸에 붙여 넣어 보세요. 이 칸의 내용은 저장하거나 전송하지 않습니다.</p><div class="button-row"><button class="button small" data-test-copy>연습 문장 복사</button><button class="button small" data-test-paste disabled>복사한 연습 문장 확인</button></div><label for="paste-practice">여기에 Ctrl+V로 붙여 넣으세요</label><textarea id="paste-practice" placeholder="휴대폰에서는 입력칸을 길게 눌러 붙여 넣기를 선택하세요." autocomplete="off" spellcheck="false"></textarea><div class="lab-result" id="paste-result" role="status"></div><details class="copy-fallback"><summary>자동 복사가 안 되면</summary><p>직접 선택할 연습 문장: ${sample}</p><label class="sr-only" for="manual-sample">직접 복사할 연습 문장</label><textarea id="manual-sample" readonly>${sample}</textarea><button data-select-prompt>연습 문장 전체 선택</button></details></article><article class="lab-card"><h2>2. 수업 운영 보드의 백업과 복원</h2><p>연습용 백업으로 복원을 경험해 보세요. 먼저 현재 보드의 수업을 백업해 두면 나중에 돌아갈 수 있어요.</p><ol class="lab-sequence"><li>아래 연습용 백업 파일을 내려받습니다.</li><li>보드에서 <strong>백업 다운로드</strong>를 눌러 현재 수업을 보관합니다.</li><li><strong>백업 불러오기</strong>로 연습 파일을 고릅니다. 현재 수업을 바꾼다는 확인 내용을 읽고 결정하세요.</li><li>‘3학년 과학 · 자석의 성질 (연습 백업)’ 수업이 보이면 성공입니다. 새로고침해도 남는지 확인하세요.</li><li>처음 보관한 백업을 불러오면 원래 수업으로 돌아갈 수 있습니다.</li></ol><div class="button-row"><a class="button small" href="./${encodeURIComponent('2026-09-20-보드-연습백업.json')}" download="2026-09-20-보드-연습백업.json">연습용 백업 내려받기 ↓</a><a class="button primary small" href="./2026-09-20-classroom-board.html" target="_blank" rel="noopener noreferrer">보드 열기 ↗</a></div><p class="source-caption">이 파일은 가상 수업 1개를 담고 있습니다. 백업은 JSON이라는 자료 보관 형식이며, 파일 내용을 직접 편집할 필요는 없어요.</p></article></section>`);
 }
 function enhance(){const key=getKey();if(window.GUIDE_SCREENS[key])setupScreen(key);setupCopyHelp();setupLab();}
 new MutationObserver(enhance).observe(main,{childList:true});
 enhance();
 document.addEventListener('click',async event=>{
  const b=event.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-tour-point')){
   const s=window.GUIDE_SCREENS[getKey()],i=Number(b.dataset.tourPoint);if(!s||!s.points[i])return;
   main.querySelectorAll('[data-tour-point]').forEach(p=>p.setAttribute('aria-pressed',String(Number(p.dataset.tourPoint)===i)));
   const panel=document.getElementById('screen-explanation');panel.querySelector('h3').textContent=s.points[i].title;panel.querySelector('p').textContent=s.points[i].text;
  }
  if(b.hasAttribute('data-enlarge-screen')){
   const s=window.GUIDE_SCREENS[getKey()],image=document.getElementById('screen-dialog-image');image.src=s.image;image.alt=s.alt;image.referrerPolicy='no-referrer';document.getElementById('screen-dialog-caption').textContent=s.caption+' '+s.warning;document.getElementById('screen-dialog').showModal();
  }
  if(b.hasAttribute('data-close-screen'))document.getElementById('screen-dialog').close();
  if(b.hasAttribute('data-select-prompt')){const input=b.closest('.copy-fallback').querySelector('textarea');input.focus();input.select();}
  if(b.hasAttribute('data-test-paste')){
   const result=document.getElementById('paste-result');
   try{const copied=await navigator.clipboard.readText();if(copied===sample){document.getElementById('paste-practice').value=sample;result.textContent='확인 완료! 클립보드의 연습 문장이 정확히 일치해요.';}else{result.textContent='클립보드가 바뀌었어요. 연습 문장을 다시 복사해 주세요.';}}
   catch{result.textContent='브라우저에서 클립보드 읽기를 허용하지 않았어요. 입력칸에 직접 Ctrl+V로 붙여 넣어 확인할 수 있습니다.';}
  }
  if(b.hasAttribute('data-test-copy')){
   const result=document.getElementById('paste-result');
   try{await navigator.clipboard.writeText(sample);main.querySelector('[data-test-paste]').disabled=false;result.textContent='복사 요청을 보냈어요. 입력칸에 붙여 넣어 실제 내용까지 확인해 주세요.';}
   catch{result.textContent='자동 복사를 사용할 수 없어요. 아래 ‘자동 복사가 안 되면’을 열어 직접 선택해 주세요.';main.querySelector('#practice-lab details').open=true;}
  }
 });
 document.addEventListener('input',event=>{if(event.target.id==='paste-practice'){const value=event.target.value.trim();document.getElementById('paste-result').textContent=!value?'':value===sample?'확인 완료! 연습 문장이 정확히 붙여 넣어졌어요.':'연습 문장과 달라요. ‘연습 문장 복사’를 누르고 다시 붙여 넣어 보세요.';}});
})();
