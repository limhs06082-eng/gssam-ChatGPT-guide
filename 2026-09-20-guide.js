/* G쌤의 AI 교실 · 외부 라이브러리 없이 실행하는 정적 가이드 */
(() => {
'use strict';
const $ = s => document.querySelector(s);
const main = $('#main');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons = {
 arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',
 chat:'<path d="M20 11.5a8 8 0 0 1-8 8H5l-4 3 1.5-6A8 8 0 1 1 20 11.5Z"/><path d="M7 10h7m-7 4h4"/>',
 work:'<rect x="4" y="6" width="16" height="15" rx="2"/><path d="M8 6V3h8v3M8 11h8m-8 4h5"/>',
 code:'<path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16"/>',
 book:'<path d="M12 5v16M12 5C9 2 5 2 2 3v16c4-1 7-1 10 2 3-3 6-3 10-2V3c-4-1-7-1-10 2Z"/>',
 download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3h.01"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
 copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V3H3v13h5"/>',
 leaf:'<path d="M20 3c-1 9-2 15-10 15A7 7 0 0 1 3 11C3 4 12 5 20 3ZM4 21l10-11"/>',
 folder:'<path d="M3 20h18V6H11L8 3H3Z"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.book}</svg>`;
const lessons = window.GUIDE_LESSONS || {};
const names = {chat:'ChatGPT 채팅',work:'ChatGPT Work',codex:'Codex'};
const keys = ['chat','work','codex'];
const storageKey = 'gssam-guide-progress-v1';
let storageOK = true, storageWarning = false, toastTimer;
let progress = {completed:[],last:null};
try {
 const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
 if (saved) {
   if (!Array.isArray(saved.completed)) throw new Error('Invalid progress');
   progress.completed = [...new Set(saved.completed.filter(k => keys.includes(k)))];
   progress.last = keys.includes(saved.last) ? saved.last : null;
 }
} catch { storageOK = false; }
function toast(message) { const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3500); }
function warnStorage() {
 if(storageWarning) return;
 storageWarning=true;
 const note=document.createElement('div');note.className='storage-warning';note.setAttribute('role','status');note.textContent='학습 기록을 저장할 수 없습니다. 지금 학습은 가능하지만, 다음 방문에 이어지지 않을 수 있어요.';
 $('.site-header').after(note);
}
function saveProgress() { if(!storageOK){warnStorage();return;}try {localStorage.setItem(storageKey,JSON.stringify(progress));}catch {storageOK=false;warnStorage();} }
const faqItems = [
 {id:'work-hidden',group:'시작과 화면',question:'내 화면에는 Work가 안 보여요.',answer:'먼저 사용하는 계정과 앱이 맞는지 확인해 주세요. 기능 제공은 요금제·플랫폼·지역·배포 상태·조직 설정에 따라 다를 수 있습니다. 공식 안내에서 현재 제공 조건을 확인하세요. 오늘은 채팅 실습부터 시작할 수 있습니다. 채팅에서 같은 초안을 만들어 봤더라도 Work 실습을 완료한 것으로 보지는 않아요.',tags:'워크 메뉴 계정 요금제 설치'},
 {id:'screen-different',group:'시작과 화면',question:'설명과 내 화면이 달라요.',answer:'웹·Windows 앱·휴대폰 앱의 메뉴는 다를 수 있습니다. 이 가이드는 Windows 사용자를 기본으로 설명하며, 버튼 위치보다 이름과 역할을 먼저 안내합니다. 기능이 보이지 않으면 무리하게 다른 메뉴를 누르지 말고 계정과 사용 환경을 확인하세요.',tags:'윈도우 화면 버튼 메뉴 버전'},
 {id:'file-unreadable',group:'파일과 결과물',question:'파일을 올렸는데 읽지 못했다고 해요.',answer:'내 컴퓨터에서 파일이 정상적으로 열리는지 먼저 확인하세요. 실습 자료실의 작은 TXT 가상 자료로 다시 시작해 보세요. “지금 실제로 읽을 수 있는 자료 이름을 알려 줘”라고 확인하고, 읽지 못한 파일을 읽었다고 가정해 작업을 이어가지 않습니다.',tags:'첨부 업로드 형식 pdf 문서'},
 {id:'no-download',group:'파일과 결과물',question:'문서를 부탁했는데 글만 나왔어요.',answer:'원하는 파일 형식을 명시하고 현재 환경에서 파일을 만들 수 있는지 물어보세요. 지원되지 않으면 받은 본문을 문서 프로그램에 붙여 넣어 편집할 수 있습니다. 파일을 받았을 때도 직접 열어 내용과 페이지 구성을 확인합니다.',tags:'다운로드 docx 결과 파일'},
 {id:'wrong-answer',group:'파일과 결과물',question:'없는 사실을 덧붙였어요.',answer:'“이 내용은 내가 제공하지 않았어. 근거를 알려주고, 근거가 없으면 확인 필요 항목으로 옮겨 줘”라고 요청하세요. AI가 다시 검토한 답만 믿지 말고 날짜·숫자·장소는 원본과 대조합니다.',tags:'환각 틀린 답변 출처 검토'},
 {id:'app-not-running',group:'Codex와 수업 운영 보드',question:'Codex가 알려준 주소가 열리지 않아요.',answer:'내 컴퓨터에서 앱을 실행하는 과정이 종료되지 않았는지 확인하세요. “현재 프로젝트를 실행하고, 내가 열 정확한 주소와 실행을 유지하는 방법을 알려 줘”라고 요청합니다. localhost 주소는 그 프로그램을 실행 중인 내 컴퓨터에서 사용하는 주소입니다.',tags:'실행 오류 localhost 연결 거부'},
 {id:'lost-data',group:'Codex와 수업 운영 보드',question:'다른 컴퓨터에서 수업이 안 보여요.',answer:'완성 예시는 현재 브라우저에 수업을 저장합니다. 자동으로 다른 컴퓨터와 동기화되지 않습니다. 원래 컴퓨터에서 ‘백업 다운로드’를 누르고, 다른 컴퓨터에서 ‘백업 불러오기’로 옮기세요. 브라우저 데이터를 지우기 전에도 백업합니다.',tags:'저장 사라짐 새로고침 백업 복원 동기화'},
 {id:'permissions',group:'Codex와 수업 운영 보드',question:'권한을 허용해 달라고 멈춰 있어요.',answer:'대상 파일이나 폴더와 하려는 행동을 먼저 읽어 보세요. 이해하기 어렵다면 “무엇을 바꾸려는지, 기존 파일에 어떤 영향이 있는지 쉬운 말로 알려 줘”라고 물어봅니다. 실습은 비어 있는 새 폴더에서 시작하고, 허용 범위를 무조건 넓히지 않습니다.',tags:'권한 승인 permission 허용'},
 {id:'progress',group:'이 가이드 이용하기',question:'완료 표시와 이어보기는 어디에 저장되나요?',answer:'이 가이드를 여는 현재 브라우저에 저장됩니다. 회원가입이나 서버 전송은 없습니다. 다른 기기·브라우저에서는 이어지지 않으며, 브라우저 데이터를 지우면 초기화될 수 있습니다. 공개된 대표 실습 3편에만 완료 표시가 제공됩니다.',tags:'진도 기록 학습 완료 개인정보'},
 {id:'planned',group:'이 가이드 이용하기',question:'학습 지도에 준비 예정이라고 표시돼요.',answer:'지금은 홈과 세 경로의 대표 실습을 먼저 공개한 버전입니다. 학습 지도에는 앞으로 확장할 목차도 함께 표시했습니다. ‘실습하기’가 붙은 대표 실습부터 이용해 주세요.',tags:'페이지 준비 개발 목차'}
];
const courses = [
 {key:'start',title:'처음 오셨나요?',items:['채팅·Work·Codex, 무엇이 다른가요?','접속하고 내 화면 확인하기','내게 맞는 학습 경로 고르기','자료 준비와 결과 검토의 기본']},
 {key:'chat',title:'ChatGPT 채팅 · 같이 생각하기',items:['학부모 공개수업 안내문 다듬기','대화를 이어가며 수정하기','좋은 요청을 만드는 네 가지 단서','파일을 넣고 질문하기','사진과 화면으로 질문하기','검색 결과와 출처 확인하기','프로젝트로 대화와 자료 모으기','수업과 교사 업무에 적용하기']},
 {key:'work',title:'ChatGPT Work · 일 맡기기',items:['가상 자료로 공개수업 안내자료 만들기','온라인 작업과 내 컴퓨터 작업 구분하기','자료와 완료 조건 전달하기','비교표와 분석 자료 만들기','문서와 발표자료 만들기','중간에 방향 바꾸기','결과물을 원본과 대조하기','다음 작업에 재사용하기']},
 {key:'codex',title:'Codex · 내 도구 만들기',items:['매일 쓰는 나만의 수업 운영 보드 만들기','시작 화면과 작업 위치 확인하기','프로젝트 폴더 이해하기','만들기 전에 함께 기획하기','실행하고 화면 확인하기','기존 기능을 지키며 수정하기','오류를 재현하고 전달하기','변경된 내용 확인하기','이전 상태로 돌아가기와 백업','내 웹앱을 인터넷에 공개하기']}
];
function card(key,i) {
 const config={chat:['chat','같이 생각하기','질문하고, 글을 다듬고, 아이디어를 정리해요. 익숙한 대화로 첫걸음을 시작합니다.','안내문 초안 다듬기'],work:['work','일 맡기기','자료와 목표를 전달하고 결과물을 받아요. 반복되는 문서 업무를 함께 해결합니다.','공개수업 안내자료 만들기'],codex:['code','내 도구 만들기','필요한 도구를 만들고, 고치고, 다시 써요. 코딩이 처음이어도 차근차근 함께합니다.','나만의 수업 운영 보드']}[key];
 return `<a class="path-card ${key}" href="#/lesson/${key}"><div class="card-top"><span class="icon-tile">${icon(config[0])}</span><span class="card-number">PATH 0${i+1}</span></div><div class="product-name">${names[key]}</div><h3>${config[1]}</h3><p>${config[2]}</p><div class="card-example"><span>${config[3]}</span>${icon('arrow')}</div><div class="card-footer"><span class="badge">${key==='codex'?'첫 프로젝트':'처음이라면'}</span><span>약 ${lessons[key]?.minutes || 10}분</span>${progress.completed.includes(key)?'<span>✓ 완료</span>':''}</div></a>`;
}
function home() {
 return `<div class="container"><section class="home-hero"><div><div class="eyebrow">선생님의 일상에, AI 한 걸음</div><h1>처음이라도 괜찮아요.<br>하나씩, <em>내 것으로.</em></h1><p class="hero-desc">질문을 나누는 채팅부터, 일을 맡기는 Work,<br>나만의 도구를 만드는 Codex까지.<br>어려운 용어보다 직접 해보는 경험으로 배워요.</p><div class="button-row"><a class="button primary" href="#/start">15분, 가볍게 시작하기 ${icon('arrow')}</a><a class="button" href="#/courses">전체 학습 지도</a></div><p class="hero-foot">${icon('check')} 가이드 회원가입 없이 · 필요한 만큼 · 내 속도로</p></div><div class="hero-visual" role="img" aria-label="완성 예시 수업 운영 보드의 개념 그림. 실제 ChatGPT 화면이 아닙니다."><div class="mini-window"><div class="window-top"><i></i><i></i><i></i><span>나의 수업 운영 보드</span></div><div class="mini-body"><div class="mini-label"><span>3학년 · 과학</span><span>준비 완료</span></div><h3>자석의 성질을 탐구해요</h3><p>오늘 수업도, 나만의 흐름으로.</p><div class="mini-activity"><b>01</b><span>생각 열기</span><small>5분</small></div><div class="mini-activity current"><b>02</b><span>모둠별 탐구 활동</span><small>25분</small></div><div class="mini-activity"><b>03</b><span>배움 정리하기</span><small>10분</small></div></div></div><div class="float-note note-one">${icon('code')} 아이디어가 내 도구로</div><div class="float-note note-two">${icon('check')} 작은 성공부터 차근차근</div><span class="visual-caption">Codex 실습 결과물 · 개념 미리보기</span></div></section>
 ${progress.last ? `<div class="progress-banner"><span><strong>다시 오셨네요.</strong> 지난 학습부터 이어갈까요?</span><div class="progress-track" aria-label="대표 실습 ${progress.completed.length}개 완료"><span style="width:${progress.completed.length/3*100}%"></span></div><span>${progress.completed.length}/3 완료</span><a href="#/lesson/${progress.last}">${names[progress.last]} 이어보기 →</a></div>`:''}
 <section class="learning-section"><div class="section-top"><div><h2>오늘, 무엇을 해볼까요?</h2><p>세 가지 경로 중 지금 필요한 것부터 골라 보세요.</p></div><a class="text-link" href="#/start">차이 알아보기 ${icon('arrow')}</a></div><div class="path-grid">${keys.map(card).join('')}</div><div class="start-strip"><span class="strip-icon">${icon('leaf')}</span><div><h3>아직 무엇부터 할지 모르겠다면</h3><p>채팅으로 안내문 한 편을 다듬어 보세요. 첫 질문은 완벽하지 않아도 괜찮아요.</p></div><a href="#/lesson/chat" class="text-link">첫 실습 시작 ${icon('arrow')}</a></div></section>
 <section class="section-tools"><div class="tool-grid"><a class="tool-link" href="#/resources">${icon('folder')}<div><h3>실습 자료, 여기 모아 두었어요</h3><p>가상 자료와 점검표를 준비하고 시작하세요.</p></div><span class="arrow">↗</span></a><a class="tool-link" href="#/help">${icon('help')}<div><h3>잠깐, 여기서 막혔나요?</h3><p>화면이 다르거나 결과가 이상할 때 찾아보세요.</p></div><span class="arrow">↗</span></a></div></section><aside class="teacher-note"><span class="avatar">G</span><div><strong>G쌤의 한마디</strong><p>모든 기능을 한 번에 알 필요는 없어요. 오늘 필요한 일 하나를 해보고,<br>다음에 또 필요할 때 돌아오세요. 이 가이드가 옆에서 도와드릴게요.</p></div></aside></div>`;
}
function heading(eyebrow,title,description) {return `<header class="page-heading"><div class="eyebrow">${esc(eyebrow)}</div><h1>${esc(title)}</h1><p>${esc(description)}</p></header>`;}
function startPage() {
 return `<div class="container page-bottom">${heading('YOUR FIRST STEP','15분, 첫 성공을 만들어 볼까요?','처음 5분은 차이를 이해하고, 다음 10분은 안내문 한 편을 다듬어 봅니다.')}<div class="intro-grid"><div class="intro-card"><span class="icon-tile">${icon('chat')}</span><h2>채팅은 대화하며</h2><p>생각을 정리하고 글을 다듬어요. 답을 보고 다시 부탁하면서 원하는 방향을 찾습니다.</p></div><div class="intro-card"><span class="icon-tile">${icon('work')}</span><h2>Work는 목표를 맡겨</h2><p>자료와 완료 조건을 주고 검토할 결과물을 받아요. 문서 작업과 자료 분석부터 시작해 봅니다.</p></div><div class="intro-card"><span class="icon-tile">${icon('code')}</span><h2>Codex는 만들고 고쳐</h2><p>작동하는 도구를 만들고 발전시켜요. 파일과 실행 결과를 확인하는 경험을 익힙니다.</p></div></div><div class="info-note">세 경로는 배우기 쉬운 출발점이에요. 기능은 서로 겹칩니다. Work에서도 프로그램 관련 일을 할 수 있고, Codex로 문서를 만들 수도 있어요. <a href="https://learn.chatgpt.com/docs/use-chatgpt" target="_blank" rel="noopener noreferrer">공식 설명 확인 ↗</a></div><h2>첫날에는 여기까지만</h2><ol class="step-route"><li><span class="step-num">01</span><div><h3>내가 원하는 결과를 골라요 <span class="badge">2분</span></h3><p>오늘은 ‘학부모가 읽기 편한 안내문’을 목표로 정합니다.</p></div></li><li><span class="step-num">02</span><div><h3>ChatGPT를 열고 준비해요 <span class="badge">3분</span></h3><p>본인 계정으로 로그인하고 새 채팅을 여세요. 학생 개인정보는 필요하지 않아요.</p></div><a class="button small" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">ChatGPT 열기 ↗</a></li><li><span class="step-num">03</span><div><h3>초안을 받고 한 번 고쳐요 <span class="badge">10분</span></h3><p>예시를 복사하고, 사실을 확인하고, 길이를 줄이는 실습입니다.</p></div><a class="button primary small" href="#/lesson/chat">안내문 실습 ${icon('arrow')}</a></li></ol><aside class="teacher-note"><span class="avatar">G</span><div><strong>시작 전 확인</strong><p>이 사이트는 학습 안내서입니다. AI가 실행되는 곳은 ChatGPT 또는 Codex예요. 실습 가능한 기능은 계정과 사용 환경에 따라 달라질 수 있습니다. 기본 안내는 Windows 기준이며 Mac에서는 메뉴가 다를 수 있어요.</p></div></aside><h2>첫 실습 다음에는</h2><div class="tool-grid"><a href="#/lesson/work" class="tool-link">${icon('work')}<div><h3>자료로 결과물 만들기</h3><p>안내문에서 배포용 안내자료로 넓혀 보세요.</p></div><span class="arrow">→</span></a><a href="#/lesson/codex" class="tool-link">${icon('code')}<div><h3>나의 수업 도구 만들기</h3><p>수업 순서와 자료를 운영 보드로 모아 보세요.</p></div><span class="arrow">→</span></a></div></div>`;
}
function coursesPage() {
 return `<div class="container page-bottom">${heading('LEARNING MAP','내 속도로 따라가는 학습 지도','세 경로의 대표 실습부터 시작하세요. 앞으로 이어질 과정도 함께 살펴볼 수 있어요.')}<div class="info-note">현재 대표 실습 <strong>3편</strong>을 이용할 수 있습니다. 아래 30개 주제 중 나머지는 확장 예정 목차이며, 아직 개별 학습 페이지가 아닙니다.</div><div class="course-tabs" role="group" aria-label="학습 경로 필터">${[['all','전체'],['start','처음 시작'],...keys.map(k=>[k,names[k]])].map(([k,n])=>`<button data-filter="${k}" class="${k==='all'?'active':''}" aria-pressed="${k==='all'}">${n}</button>`).join('')}</div>${courses.map(g=>`<section class="course-group" data-group="${g.key}"><h2>${g.title} <span class="badge">${g.items.length}개 주제</span></h2>${g.items.map((t,i)=>{const ready=keys.includes(g.key)&&i===0;return `<${ready?'a':'div'} ${ready?`href="#/lesson/${g.key}"`:''} class="course-row ${ready?'published':'planned'}"><span class="order">${String(i+1).padStart(2,'0')}</span><span>${t}</span><span class="badge ${ready?'ready':''}">${ready?'실습하기 →':'준비 예정'}</span></${ready?'a':'div'}>`;}).join('')}</section>`).join('')}</div>`;
}
const resources = [
 {title:'공개수업 가상 계획서',description:'일정·장소·수업 흐름이 정리된 자료예요. Work 실습에서 준비 메모와 함께 사용합니다.',file:'2026-09-20-공개수업-계획.txt',meta:'TXT · 가상 자료 · 3학년 과학'},
 {title:'공개수업 준비 메모',description:'내부 준비 사항과 미확정 정보가 섞여 있어요. 학부모에게 전달할 정보와 구분해 보세요.',file:'2026-09-20-공개수업-메모.txt',meta:'TXT · 가상 자료 · 교사용'},
 {title:'결과물 확인 체크리스트',description:'안내문과 운영 보드를 사용하기 전에 직접 확인할 항목을 모았습니다.',file:'2026-09-20-실습-체크리스트.md',meta:'Markdown · 메모장으로 열 수 있어요'},
];
function resourcesPage() {
 return `<div class="container page-bottom">${heading('PRACTICE KIT','연습할 자료부터 준비해요','실제 학생 정보 없이도 충분히 실습할 수 있도록 가상 자료를 준비했습니다.')}<div class="resource-grid">${resources.map(r=>`<article class="resource-card">${icon('download')}<h2>${r.title}</h2><p>${r.description}</p><div class="file-meta">${r.meta}</div><a class="button small" href="./${encodeURIComponent(r.file)}" download="${r.file}">자료 내려받기 ${icon('download')}</a></article>`).join('')}<article class="resource-card">${icon('code')}<h2>수업 운영 보드 완성 예시</h2><p>수업 만들기·활동 편집·진행 화면·저장·백업을 직접 경험해 보세요. Codex로 만들 결과의 참고 예시입니다.</p><div class="file-meta">브라우저에서 실행 · 개인정보 입력 없이</div><a class="button small" href="./2026-09-20-classroom-board.html" target="_blank" rel="noopener noreferrer">완성 예시 열기 ↗</a></article></div><div class="info-note">다운로드한 자료는 모두 실습을 위해 만든 가상 내용입니다. 실제 학부모 안내문으로 그대로 사용하지 마세요. Work 실습에는 계획서와 준비 메모 두 파일을 함께 전달합니다.</div><h2>자료를 받았다면</h2><div class="button-row"><a class="button primary" href="#/lesson/work">Work 실습 시작 ${icon('arrow')}</a><a class="button" href="#/lesson/codex">Codex 실습 보기</a></div></div>`;
}
function helpPage() {
 return `<div class="container page-bottom">${heading('WHEN YOU GET STUCK','막혔을 때, 여기서 다시 시작해요','처음부터 다시 할 필요는 없어요. 지금 겪는 상황과 가장 가까운 항목을 골라 보세요.')}<div class="button-row" style="margin-bottom:27px"><button class="button" data-search>${icon('help')} 증상이나 오류로 검색</button><a class="text-link" href="https://learn.chatgpt.com/docs/use-chatgpt" target="_blank" rel="noopener noreferrer">공식 사용 안내 ↗</a></div>${[...new Set(faqItems.map(f=>f.group))].map(g=>`<section class="faq-group"><h2>${g}</h2>${faqItems.filter(f=>f.group===g).map(f=>`<details class="faq" id="faq-${f.id}"><summary>${f.question}</summary><p>${f.answer}</p></details>`).join('')}</section>`).join('')}<aside class="teacher-note"><span class="avatar">G</span><div><strong>오류를 설명하는 세 문장</strong><p>“이 순서로 눌렀어요. 이렇게 될 줄 알았어요. 실제로는 이렇게 나왔어요.”<br>이 세 가지를 함께 알려주면 수정할 곳을 찾기 쉬워집니다.</p></div></aside></div>`;
}
function lessonPage(key) {
 const l=lessons[key];if(!l)return notFound();
 progress.last=key;saveProgress();
 return `<div class="lesson-shell"><aside class="lesson-sidebar"><p class="sidebar-title">작은 성공부터, 차근차근</p><a class="sidebar-link" href="#/start">${icon('leaf')} 처음 시작하기</a>${keys.map(k=>`<a class="sidebar-link ${k===key?'active':''}" href="#/lesson/${k}" ${k===key?'aria-current="page"':''}>${icon(k==='codex'?'code':k)}${names[k]} ${progress.completed.includes(k)?'✓':''}</a>`).join('')}<a class="sidebar-link" href="#/resources">${icon('folder')} 실습 자료</a><a class="sidebar-link" href="#/help">${icon('help')} 문제 해결</a><div class="sidebar-note">대표 실습 ${progress.completed.length}/3 완료<br>학습 기록은 이 브라우저에<br>저장됩니다.</div></aside><article class="lesson-article"><div class="breadcrumb"><a href="#/">홈</a><span>/</span><a href="#/courses">학습 과정</a><span>/</span><span>${names[key]}</span></div><div class="eyebrow">${esc(l.eyebrow)}</div><h1 class="lesson-title">${esc(l.title)}</h1><p class="lesson-summary">${esc(l.summary)}</p><div class="lesson-meta"><span class="badge">${key==='codex'?'첫 프로젝트':'초보 필수'}</span><span>약 ${l.minutes}분</span><span>Windows 기본 안내</span><span>2026-09-20 확인</span></div><div class="outcome"><strong>오늘의 완성 목표</strong><p>${esc(l.outcome)}</p></div>
 ${key==='codex'?`<aside class="demo-banner"><strong>먼저 완성 모습을 경험해 보세요</strong><p>수업을 복제하고, 활동을 옮기고, 진행 화면을 열어 보세요. 직접 만들 도구가 한결 선명해집니다.</p><a class="button small" href="./2026-09-20-classroom-board.html" target="_blank" rel="noopener noreferrer">수업 운영 보드 열기 ↗</a></aside>`:''}
 <section id="prepare" class="anchor-section"><h2>시작 전에 준비해요</h2><ul>${l.prerequisites.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>${key==='work'?'<a class="button small" href="#/resources">실습 자료 받으러 가기 →</a>':''}${key==='codex'?'<p class="source-caption">Codex를 처음 여는 경우 <a href="https://learn.chatgpt.com/docs/quickstart" target="_blank" rel="noopener noreferrer">공식 시작 안내</a>에서 현재 설치·로그인 방법을 확인하세요. 계정과 앱에 따라 선택 화면이 다를 수 있습니다.</p>':''}</section><section id="practice" class="anchor-section"><h2>직접 해봅시다</h2>${l.steps.map((s,i)=>`<section class="lesson-step" id="step-${i+1}"><div class="step-heading"><span class="number">${i+1}</span><h3>${esc(s.title.replace(/^\d+\.\s*/,''))}</h3></div><p>${esc(s.text)}</p>${s.prompt?`<div class="prompt-box"><div class="prompt-top"><span>이렇게 말해보세요</span><button class="copy-button" data-copy="${key}:${i}">${icon('copy')} 복사</button></div><pre>${esc(s.prompt)}</pre></div>`:''}</section>`).join('')}</section><section id="success" class="anchor-section"><h2>이렇게 나오면 성공입니다</h2><ul class="success-list">${l.checks.map(c=>`<li>${icon('check')}<span>${esc(c)}</span></li>`).join('')}</ul></section><section id="trouble" class="anchor-section"><h2>잘 안 된다면</h2>${l.troubleshooting.map(f=>`<details class="faq"><summary>${esc(f.question)}</summary><p>${esc(f.answer)}</p></details>`).join('')}</section><section id="tip" class="anchor-section"><h2>G쌤 팁</h2><p>${esc(l.tip)}</p></section><div class="sources">공식 근거 · 화면과 제공 기능은 업데이트될 수 있어요.<br>${l.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`).join('')}</div><div class="complete-panel"><div><strong>직접 해보셨나요?</strong><p>결과를 확인했다면 학습 기록을 남겨 주세요.</p></div><button class="button primary" data-complete="${key}" aria-pressed="${progress.completed.includes(key)}">${progress.completed.includes(key)?'✓ 학습 완료 · 취소':'완료로 표시'}</button></div><nav class="lesson-nav" aria-label="이전 다음 학습"><a href="${key==='chat'?'#/start':`#/lesson/${keys[keys.indexOf(key)-1]}`}">← ${key==='chat'?'처음 시작하기':names[keys[keys.indexOf(key)-1]]}</a><a href="${key==='codex'?'#/courses':`#/lesson/${keys[keys.indexOf(key)+1]}`}">${key==='codex'?'전체 학습 지도':names[keys[keys.indexOf(key)+1]]} →</a></nav></article><aside class="lesson-toc"><p>이 페이지에서</p>${[['prepare','시작 전 준비'],['practice','직접 해봅시다'],['success','성공 기준'],['trouble','잘 안 된다면'],['tip','G쌤 팁']].map(([id,t])=>`<a href="#/lesson/${key}?section=${id}" data-scroll="${id}">${t}</a>`).join('')}<p class="tip-small">예시 요청문은 출발점이에요.<br>나의 상황에 맞춰<br>조금씩 바꿔 보세요.</p></aside></div>`;
}
function notFound(){return `<div class="container">${heading('TAKE A STEP BACK','이 페이지는 찾을 수 없어요.','홈이나 학습 지도에서 다시 시작해 주세요.')}<div class="empty-state"><a class="button primary" href="#/">홈으로 돌아가기</a></div></div>`;}
let currentRoute='';
function render() {
 const route=(location.hash.slice(1)||'/');const [path,query]=route.split('?');const params=new URLSearchParams(query||'');currentRoute=path;
 const page=path==='/'?home:path==='/start'?startPage:path==='/courses'?coursesPage:path==='/resources'?resourcesPage:path==='/help'?helpPage:path.startsWith('/lesson/')?()=>lessonPage(path.split('/')[2]):notFound;
 main.innerHTML=page();
 const key=path.split('/')[2];document.title=(path==='/'?'':path.startsWith('/lesson/')&&lessons[key]?lessons[key].title+' · ':({'/start':'처음 시작하기','/courses':'학습 지도','/resources':'실습 자료','/help':'문제 해결'}[path]||'페이지 찾기')+' · ')+'G쌤의 AI 교실';
 document.querySelectorAll('.top-nav a').forEach(a=>{const active=a.hash==='#'+path||(path.startsWith('/lesson/')&&a.hash==='#/courses');a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 $('.top-nav').classList.remove('open');$('.mobile-menu').setAttribute('aria-expanded','false');$('.mobile-menu').setAttribute('aria-label','메뉴 열기');
 window.scrollTo(0,0);main.focus({preventScroll:true});
 if(params.has('faq')){const item=document.getElementById('faq-'+params.get('faq'));if(item){item.open=true;requestAnimationFrame(()=>item.scrollIntoView({block:'center'}));}}
 if(params.has('section')){const item=document.getElementById(params.get('section'));if(item)requestAnimationFrame(()=>item.scrollIntoView());}
 if(!storageOK)warnStorage();
}
const searchDialog=$('#search-dialog');
const searchData=[...keys.filter(k=>lessons[k]).map(k=>({title:lessons[k].title,category:names[k],url:`#/lesson/${k}`,body:[names[k],lessons[k].summary,...lessons[k].steps.map(s=>s.text+' '+(s.prompt||''))].join(' ')})),...faqItems.map(f=>({title:f.question,category:'문제 해결',url:`#/help?faq=${f.id}`,body:f.answer+' '+f.tags})),{title:'실습 자료 내려받기',category:'자료실',url:'#/resources',body:'공개수업 계획서 메모 파일 다운로드 체크리스트 완성 예시'},{title:'15분, 첫 성공을 만들어 볼까요?',category:'처음 시작하기',url:'#/start',body:'처음 차이 계정 시작 채팅 Work Codex'}];
function search(){const query=$('#search-input').value.trim().toLocaleLowerCase();const words=query.split(/\s+/).filter(Boolean);const result=searchData.filter(r=>words.every(w=>(r.title+' '+r.category+' '+r.body).toLocaleLowerCase().includes(w)));$('#search-results').innerHTML=result.length?result.slice(0,12).map(r=>`<a class="search-result" href="${r.url}" data-search-result><strong>${esc(r.title)}</strong><small>${esc(r.category)}</small></a>`).join(''):`<p class="search-empty">“${esc(query)}”에 맞는 결과가 없어요.<br>‘파일’, ‘저장’, ‘Work’처럼 짧게 검색해 보세요.</p>`;}
function openSearch(){searchDialog.showModal();$('#search-input').value='';search();$('#search-input').focus();}
document.addEventListener('click',async event=>{
 const target=event.target.closest('button,a');if(!target)return;
 if(target.hasAttribute('data-search'))openSearch();
 if(target.hasAttribute('data-close-search'))searchDialog.close();
 if(target.hasAttribute('data-search-result'))searchDialog.close();
 if(target.classList.contains('mobile-menu')){const isOpen=$('.top-nav').classList.toggle('open');target.setAttribute('aria-expanded',String(isOpen));target.setAttribute('aria-label',isOpen?'메뉴 닫기':'메뉴 열기');}
 if(target.dataset.filter){const filter=target.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b.dataset.filter===filter);b.setAttribute('aria-pressed',String(b.dataset.filter===filter));});document.querySelectorAll('[data-group]').forEach(g=>g.hidden=filter!=='all'&&g.dataset.group!==filter);}
 if(target.dataset.scroll){event.preventDefault();document.getElementById(target.dataset.scroll)?.scrollIntoView({behavior:'smooth'});}
 if(target.dataset.copy){const [key,index]=target.dataset.copy.split(':');const value=lessons[key].steps[Number(index)].prompt;try{await navigator.clipboard.writeText(value);toast('요청문을 복사했어요. ChatGPT 또는 Codex에 붙여 넣으세요.');}catch{const text=target.closest('.prompt-box').querySelector('pre');const range=document.createRange();range.selectNodeContents(text);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);toast('자동 복사를 사용할 수 없어요. 선택된 요청문을 Ctrl+C로 복사해 주세요.');}}
 if(target.dataset.complete){const key=target.dataset.complete;const isDone=progress.completed.includes(key);progress.completed=isDone?progress.completed.filter(k=>k!==key):[...progress.completed,key];saveProgress();target.setAttribute('aria-pressed',String(!isDone));target.textContent=isDone?'완료로 표시':'✓ 학습 완료 · 취소';const sidebar=$('.sidebar-note');if(sidebar)sidebar.innerHTML=`대표 실습 ${progress.completed.length}/3 완료<br>학습 기록은 이 브라우저에<br>저장됩니다.`;document.querySelectorAll('.lesson-sidebar .sidebar-link').forEach(link=>{const k=link.hash.split('/').pop();if(keys.includes(k))link.innerHTML=icon(k==='codex'?'code':k)+names[k]+(progress.completed.includes(k)?' ✓':'');});toast(isDone?'완료 표시를 취소했어요.':storageOK?'작은 성공 하나를 기록했어요. 잘하셨어요!':'이 화면에 완료를 표시했어요. 브라우저 저장은 사용할 수 없어요.');}
 if(target.getAttribute('href')==='#main'){event.preventDefault();main.focus();main.scrollIntoView();}
});
$('#search-input').addEventListener('input',search);
document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(searchDialog.open)searchDialog.close();else openSearch();}});
searchDialog.addEventListener('click',event=>{if(event.target===searchDialog){const r=searchDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)searchDialog.close();}});
window.addEventListener('hashchange',render);
window.addEventListener('storage',event=>{if(event.key===storageKey||event.key===null){try{const saved=JSON.parse(event.newValue||'null');progress={completed:Array.isArray(saved?.completed)?[...new Set(saved.completed.filter(k=>keys.includes(k)))]:[],last:keys.includes(saved?.last)?saved.last:null};
 const y=window.scrollY;
 if(currentRoute==='/')main.innerHTML=home();
 const complete=$('[data-complete]');if(complete){const done=progress.completed.includes(complete.dataset.complete);complete.setAttribute('aria-pressed',String(done));complete.textContent=done?'✓ 학습 완료 · 취소':'완료로 표시';}
 const note=$('.sidebar-note');if(note)note.innerHTML=`대표 실습 ${progress.completed.length}/3 완료<br>학습 기록은 이 브라우저에<br>저장됩니다.`;
 document.querySelectorAll('.lesson-sidebar .sidebar-link').forEach(link=>{const k=link.hash.split('/').pop();if(keys.includes(k))link.innerHTML=icon(k==='codex'?'code':k)+names[k]+(progress.completed.includes(k)?' ✓':'');});
 window.scrollTo(0,y);
 }catch{toast('다른 탭의 학습 기록을 읽지 못했어요.');}}});
render();
})();
