/* 실제 캡처와 공식 예시를 구분하고 이미지 비율에 맞춰 번호를 표시합니다. */
window.GUIDE_SCREENS = {
 setup: {
  image:'./2026-09-28-화면-setup.png', width:1280, height:650, checkedDate:'2026-09-28',
  alt:'실습 계정의 Chat 시작 화면. 왼쪽 새 채팅 아이콘, 위쪽 Chat 선택, 가상 안내문 요청 입력창과 보내기 버튼입니다.',
  source:'https://learn.chatgpt.com/docs/quickstart', sourceLabel:'OpenAI · 시작하기 기능 안내',
  caption:'2026-09-28 실습 계정에서 가상 안내문 요청을 입력한 화면입니다. 계정과 버전에 따라 다를 수 있어요.',
  warning:'로그인 과정은 담지 않았어요. 사이드바 기록과 계정 정보는 캡처에서 제외했습니다. 실제 작업은 내 ChatGPT 화면에서 합니다.',
  points:[
   {x:2,y:12,title:'새 채팅으로 시작해요',text:'사이드바를 접으면 연필 모양 아이콘으로 보여요. 새 대화를 열어도 이전 모드가 유지될 수 있으니 Chat 선택도 확인합니다.'},
   {x:48,y:4,title:'Chat을 선택해요',text:'이번 입문은 짧은 질문을 보내는 Chat 실습이에요. Work가 켜져 있으면 Chat을 선택하세요.'},
   {x:34,y:61,title:'요청문을 붙여 넣어요',text:'ChatGPT에게 물어보세요 입력창에 아래 실습의 가상 수업 질문을 넣습니다. 이 캡처에는 같은 입력창에서 안내문 요청을 연습한 모습이 담겨 있어요.'},
   {x:80,y:90,title:'보내기 버튼을 눌러요',text:'글을 입력하면 입력창 오른쪽에 위쪽 화살표가 나타납니다. 보내기 또는 Enter로 요청하고 답변을 읽어 보세요.'}
  ]
 },
 chat: {
  image:'./2026-09-28-화면-chat-검수.png', width:1228, height:400, checkedDate:'2026-09-28',
  alt:'실습 계정에서 Chat을 선택한 시작 화면. 요청 입력창과 파일 등 추가 버튼이 보입니다.',
  source:'https://learn.chatgpt.com/docs/use-chatgpt', sourceLabel:'OpenAI · ChatGPT 사용 안내',
  caption:'2026-09-28 실습 계정에서 캡처한 Chat 시작 화면입니다. 계정과 버전에 따라 다를 수 있어요.',
  warning:'그림 안 번호는 위치 설명용이에요. 아래 요청을 복사한 뒤 내 ChatGPT 입력창에서 보내세요. 답변이 편집 문서 상자로 나와도 그 안의 날짜·시간·장소를 확인하면 됩니다.',
  points:[
   {x:46,y:6.5,title:'Chat 선택을 확인해요',text:'새 채팅을 연 뒤 Chat을 선택합니다. 이번에는 가상 행사 정보를 글로 전달하고 같은 대화에서 안내문을 수정할 거예요.'},
   {x:39,y:90.5,title:'입력창에 요청을 넣어요',text:'ChatGPT에게 물어보세요 입력창에 2단계 요청문을 붙여 넣습니다. Enter 또는 글을 입력한 뒤 나타나는 보내기로 전송합니다.'},
   {x:21,y:90.5,title:'자료 추가 버튼을 알아 둬요',text:'입력창의 +는 파일 등 추가 버튼입니다. 이번 안내문 실습은 가상 정보를 본문으로 주므로 파일 없이도 진행할 수 있어요.'}
  ]
 },
 files: {
  image:'./2026-09-28-화면-files-검수.png', width:1000, height:590, checkedDate:'2026-09-28',
  alt:'실습 계정 Chat 입력창에 가상 계획서와 준비 메모 두 파일의 첨부 카드가 표시된 화면입니다.',
  source:'https://learn.chatgpt.com/docs/artifacts-viewer', sourceLabel:'OpenAI · 파일 작업 안내',
  caption:'2026-09-28 실습 계정에서 가상 TXT 두 파일을 실제로 첨부한 직후의 화면입니다. 계정과 버전에 따라 다를 수 있어요.',
  warning:'긴 파일 이름은 화면에서 일부 생략될 수 있어요. 파일 선택 창에서 계획서와 메모 이름을 먼저 확인하세요. 카드 두 개가 보이고 업로드 중 표시가 사라진 뒤 요청을 보냅니다. 첨부가 끝났더라도 내용을 읽었는지는 답변의 근거를 원본과 대조해 확인해요.',
  points:[
   {x:56,y:4.5,title:'Chat 선택을 확인해요',text:'파일 질문 편은 Chat을 선택하고 시작합니다. Work 실습을 할 때는 Work가 켜져 있는지도 함께 확인하세요.'},
   {x:25.6,y:94,title:'파일 등 추가로 두 파일을 골라요',text:'입력창 왼쪽의 + 버튼에서 사진 및 파일 추가를 고릅니다. 계획서와 준비 메모 두 파일을 선택하세요.'},
   {x:32.3,y:69.5,title:'계획서 첨부 카드를 확인해요',text:'첫 번째 자료는 2026-09-20-공개수업-계획.txt입니다. 행사 날짜·시간·장소와 수업 흐름을 담은 가상 자료예요.'},
   {x:49.5,y:69.5,title:'준비 메모도 함께 확인해요',text:'두 번째 자료는 2026-09-20-공개수업-메모.txt입니다. 내부 준비와 미확정 정보를 계획서와 함께 대조합니다. 두 파일의 업로드가 끝나면 아래 읽기 확인 요청을 보내세요.'}
  ]
 },
 environment: {
  image:'./2026-09-28-화면-environment-검수.png', width:1228, height:515, checkedDate:'2026-09-28',
  alt:'실습 계정에서 Work를 선택한 웹 시작 화면. ChatGPT로 Work 시작 입력창과 추가 버튼이 보입니다.',
  source:'https://learn.chatgpt.com/docs/get-started-with-work', sourceLabel:'OpenAI · Work 시작 안내',
  caption:'2026-09-28 실습 계정에서 Work를 선택하고 캡처한 웹 화면입니다. 계정과 버전에 따라 다를 수 있어요.',
  warning:'이 화면은 브라우저의 온라인 Work예요. 파일 경로만 적으면 내 컴퓨터의 자료를 읽지 못해요. 첨부 또는 이름을 구분한 본문 붙여 넣기로 전달한 뒤 실제로 읽은 범위를 확인합니다.',
  points:[
   {x:54.5,y:5,title:'Work를 선택해요',text:'새 대화 상단의 Work를 선택하면 어떤 작업을 할까요? 화면과 Work 시작 입력창이 나타납니다.'},
   {x:40,y:71,title:'Work 시작 입력창을 찾아요',text:'ChatGPT로 Work 시작이라고 적힌 칸에 자료·목표·완료 조건을 입력합니다. 이 계정에는 별도의 새 작업 버튼이 없어요.'},
   {x:21,y:85,title:'컴퓨터의 자료를 전달해요',text:'파일 등 추가 → 사진 및 파일 추가(컴퓨터에서 업로드)에서 파일을 선택합니다. 파일 이름이 보이는지 확인하고, 답변의 근거를 원본과 대조하세요.'}
  ]
 },
 work: {
  image:'./2026-09-28-화면-work-첨부결과-검수.png', width:850, height:590, checkedDate:'2026-09-28',
  alt:'실습 계정 Work에서 만든 안내자료와 교사 확인 목록의 수정본 결과 카드입니다.',
  source:'https://learn.chatgpt.com/docs/artifacts-viewer', sourceLabel:'OpenAI · 결과 파일 검토 안내',
  caption:'2026-09-28 실습 계정에서 가상 TXT 두 파일을 실제로 첨부하고 검토·수정한 DOCX 결과입니다. 계정과 버전에 따라 다를 수 있어요.',
  warning:'보내기 전에는 첨부한 파일 두 개를, 작업 후에는 원본과 결과물의 내용을 확인해요. 이 실습에서는 두 수정본을 미리보기로 열고 실제로 내려받아 일정을 대조했습니다. 다운로드가 끝나면 내 컴퓨터의 파일도 열어 확인하세요.',
  points:[
   {x:26.5,y:4.5,title:'Work 결과인지 확인해요',text:'작업 제목 옆에 Work가 표시돼요. 시작할 때 Work를 선택하는 화면은 작업 환경 편에서 볼 수 있습니다.'},
   {x:55,y:72.5,title:'학부모용 수정본을 열어요',text:'첫 번째 결과 카드를 눌러 미리보기 열기로 내용을 확인합니다. 날짜·시간·장소가 원본과 같고 교사 내부 메모가 빠졌는지 살펴보세요. 열린 미리보기의 다운로드로 저장할 수 있어요.'},
   {x:55,y:90.5,title:'교사용 수정본도 확인해요',text:'두 번째 카드는 교사용 확인 목록 수정본이에요. 주차·신청·촬영 미확정과 09:40 내부 점검, 지난 09:50 시간을 여기에서 구분합니다. 이 문서도 내려받은 뒤 내 컴퓨터의 파일을 확인하세요.'}
  ]
 },
 projects: {
  image:'./2026-10-06-화면-projects.png', width:1420, height:650, checkedDate:'2026-10-06',
  alt:'사용자 계정에서 만든 가상수업 캡처 실습 프로젝트의 사이드바 항목과 프로젝트 설정의 지침 칸입니다. 무관한 기록과 기존 요청 초안은 단색으로 가렸습니다.',
  source:'https://learn.chatgpt.com/docs/projects', sourceLabel:'OpenAI · 프로젝트 공식 기능 안내',
  caption:'2026-10-06 사용자 계정에서 진행한 캡처 실습 화면입니다. 계정과 버전에 따라 다를 수 있어요. 공식 기능 안내: https://learn.chatgpt.com/docs/projects',
  warning:'이 계정에서는 프로젝트 이름 옆 메뉴 → 프로젝트 설정에서 지침을 편집했어요. 가상 지침을 저장한 뒤 다시 열어 확인했습니다. Sources 파일 영역과 프로젝트 전용 입력창을 함께 보여 주는 캡처는 미완료예요. 화면 뒤의 기존 요청 초안과 무관한 기록은 가렸고 대화는 보내지 않았습니다.',
  points:[
   {x:14,y:53,title:'실습 프로젝트를 구분해요',text:'왼쪽 프로젝트 목록에 2026-10-06-가상수업-캡처실습이 있어요. 이름 옆 프로젝트 액션 메뉴에서 프로젝트 설정을 선택했습니다.'},
   {x:53,y:10.5,title:'프로젝트 설정을 열어요',text:'현재 확인한 웹 화면은 별도의 프로젝트 설정 창이에요. 프로젝트 이름과 지침을 여기에서 확인할 수 있습니다. 계정에 따라 프로젝트 화면이나 메뉴 구성이 다를 수 있어요.'},
   {x:60,y:42,title:'지침 칸에 공통 기준을 적어요',text:'지침은 대화 입력창과 구분된 설정 칸이에요. 가상 자료만 사용하고 외부 공유·발송을 하지 않는 기준을 넣었습니다. 수정하면 나타나는 저장을 누른 뒤 다시 열어 확인하세요.'}
  ]
 },
 login: {
  image:'./2026-10-06-화면-login.png', width:1360, height:775, checkedDate:'2026-10-06',
  alt:'Firebase Authentication의 로그인 방법에서 Google 제공업체 구성을 연 실제 화면입니다. Google 로그인 사용 설정은 꺼져 있습니다.',
  source:'https://firebase.google.com/docs/auth/web/google-signin', sourceLabel:'Firebase · Google 로그인 공식 안내',
  caption:'2026-10-06 사용자 계정에서 진행한 캡처 실습 화면입니다. 계정과 버전에 따라 다를 수 있어요. 공식 기능 안내: https://firebase.google.com/docs/auth/web/google-signin',
  warning:'기존 프로젝트의 설정 화면만 열었어요. Google 사용 설정을 바꾸거나 저장하지 않고 취소했습니다. 캡처는 로그인 연결·서버 인증 검증·권한 보호를 완료했다는 증거가 아닙니다. 계정·프로젝트 이름·요금제 영역은 제외했고 비밀 값은 펼치지 않았어요.',
  points:[
   {x:22,y:28,title:'로그인 제공업체를 찾아요',text:'Authentication → 로그인 방법에서 로그인 제공업체 목록을 확인해요. Google이 목록에 없으면 새 제공업체 추가에서 Google을 고르면 이 구성 화면이 열립니다.'},
   {x:34,y:56.5,title:'Google 구성인지 확인해요',text:'제공업체 구성에 Google이 표시돼요. 다른 제공업체나 프로젝트의 설정을 바꾸지 않도록 먼저 확인합니다.'},
   {x:68,y:56.5,title:'사용 설정의 위치를 알아 둬요',text:'오른쪽 스위치는 Google 로그인 사용 설정이에요. 이 캡처에서는 꺼져 있습니다. 실제 연결 실습은 본인의 별도 실습 프로젝트에서 공식 순서와 지원 이메일을 확인한 뒤 진행하세요.'}
  ]
 },
 railway: {
  image:'./2026-10-06-화면-railway.png', width:1200, height:450, checkedDate:'2026-10-06',
  alt:'Railway의 기존 서비스 카드가 Online이고 Deployments에 ACTIVE와 Deployment successful, 공개 도메인이 표시된 영어 화면입니다.',
  source:'https://docs.railway.com/quick-start', sourceLabel:'Railway · 배포 공식 안내',
  caption:'2026-10-06 사용자 계정에서 진행한 캡처 실습 화면입니다. 계정과 버전에 따라 다를 수 있어요. 표시 언어는 영어입니다. 공식 기능 안내: https://docs.railway.com/quick-start',
  warning:'이미 실행 중이던 기존 서비스의 상태를 읽기만 했어요. 새 배포·도메인 생성·결제 수단 등록은 하지 않았습니다. 계정 아이콘과 비용 정보는 가리거나 제외했어요. Usage는 프로젝트 패널과 다른 대시보드 메뉴에 있어 1단계의 별도 실제 캡처 링크로 확인합니다. 이 상태만으로 DB 저장이나 기기 간 동기화를 확인한 것은 아니에요.',
  points:[
   {x:12,y:70,title:'서비스 카드를 확인해요',text:'왼쪽 카드의 Online은 이 기존 서비스가 현재 실행 중임을 보여 줍니다. 캡처 작업에서 새 서버를 만든 것은 아니에요.'},
   {x:43,y:41.5,title:'공개 도메인 위치를 찾아요',text:'Deployments 아래에 이 기존 서비스의 공개 도메인이 표시됩니다. 주소가 있다는 것과 데이터가 안전하게 저장된다는 것은 별도로 확인해야 해요.'},
   {x:52,y:70,title:'배포 상태를 읽어요',text:'Deployments의 ACTIVE와 Deployment successful을 함께 확인합니다. 내 실습에서는 배포한 커밋과 상태 응답도 따로 대조하고, 비용은 대시보드의 Usage에서 확인하세요.'}
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
  return `<section class="screen-tour" id="screen-tour" aria-labelledby="screen-tour-title"><h2 id="screen-tour-title">화면에서 먼저 찾아보세요</h2><p class="screen-intro">번호를 누르면 해당 위치에서 할 일을 볼 수 있어요. 캡처 날짜와 내 화면의 차이도 함께 확인하세요.</p><div class="screen-frame ${key}" data-screen-frame${s.width&&s.height?` style="aspect-ratio:${s.width}/${s.height}"`:""}><img src="${s.image}" alt="${esc(s.alt)}" loading="lazy" referrerpolicy="no-referrer"><div class="screen-image-error" role="status">화면 이미지를 불러오지 못했어요.<br>아래 번호 설명으로 계속 배우거나 공식 원문을 열어 보세요.</div>${s.points.map((p,i)=>`<button class="hotspot" style="--x:${p.x}%;--y:${p.y}%" data-tour-point="${i}" aria-label="${i+1}. ${esc(p.title)}" aria-pressed="${i===0}" aria-controls="screen-explanation">${i+1}</button>`).join('')}</div><div class="screen-caption"><p>${esc(s.caption)}</p><button class="button small" data-enlarge-screen>화면 크게 보기 ↗</button></div><p class="screen-attribution">${s.width?"실습 화면의 공식 기능 안내":"화면 출처"}: <a href="${s.source}" target="_blank" rel="noopener noreferrer">${s.sourceLabel} ↗</a> · ${s.checkedDate||"2026-09-20"} 확인</p><div class="screen-choices" role="group" aria-label="화면 안내 단계">${s.points.map((p,i)=>`<button data-tour-point="${i}" aria-pressed="${i===0}" aria-controls="screen-explanation">${i+1}. ${esc(p.title)}</button>`).join('')}</div><div class="screen-explanation" id="screen-explanation" aria-live="polite"><h3>${esc(s.points[0].title)}</h3><p>${esc(s.points[0].text)}</p></div><div class="screen-warning">${esc(s.warning)}</div></section>`;
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
