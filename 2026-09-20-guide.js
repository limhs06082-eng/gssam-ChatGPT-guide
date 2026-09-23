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
const names = {choose:'도구 선택',setup:'시작 준비',prompt:'요청과 후속 질문',privacy:'자료와 개인정보',chat:'ChatGPT 채팅',files:'파일 질문',search:'검색과 출처',projects:'프로젝트 활용',work:'ChatGPT Work',environment:'작업 환경 구분',brief:'자료와 완료 조건',redirect:'작업 방향 변경',reuse:'다음 작업에 재사용',compare:'비교와 분석',documents:'문서와 발표자료',review:'원본 대조와 검토',codex:'Codex',plan:'만들기 전 기획',debug:'오류 재현과 해결',publish:'인터넷 공개',workspace:'작업 위치 확인',folders:'프로젝트 폴더',run:'실행과 화면 확인',modify:'기능 지키며 수정',changes:'변경 내용 확인',backup:'되돌리기와 백업',followup:'후속 요청',clues:'요청의 네 단서',images:'사진과 화면 질문',teaching:'교사 업무 적용'};
/* 학습 순서는 이 한 곳에서만 정한다. 홈·학습 지도·사이드바·이전/다음이 모두 이 순서를 따르고, 준비편이 그 준비가 필요한 실습보다 앞에 온다. */
const order = {start:['choose','setup','prompt','privacy'],chat:['chat','followup','files','clues','images','search','projects','teaching'],work:['environment','brief','work','redirect','compare','documents','review','reuse'],codex:['workspace','folders','run','codex','plan','modify','changes','debug','backup','publish']};
const groupNames = {start:'공통 입문',chat:'ChatGPT 채팅',work:'ChatGPT Work',codex:'Codex'};
const foundationKeys = order.start;
const pathKeys = ['chat','work','codex'];
const keys = [...order.start,...order.chat,...order.work,...order.codex];
const groupOf = key => pathKeys.find(g=>order[g].includes(key)) || 'start';
const position = key => {const g=groupOf(key);return {group:g,label:groupNames[g],index:order[g].indexOf(key)+1,total:order[g].length};};
/* 다음 학습 추천: 가장 최근에 완료한 편 다음부터 순서대로 첫 미완료 편. 완료 기록이 없으면 마지막으로 본 편, 그것도 없으면 첫 편. 모두 마쳤으면 null. */
function nextLesson() {
 if(!progress.completed.length) return progress.last || keys[0];
 const start=keys.indexOf(progress.completed[progress.completed.length-1])+1;
 for(let i=0;i<keys.length;i++){const k=keys[(start+i)%keys.length];if(!progress.completed.includes(k))return k;}
 return null;
}
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
/* 용어 사전: 본문에서 처음 나오는 기술 용어를 한 줄로 풀이한다. 문제 해결 페이지 아래에 표시하고 검색에도 포함한다. */
const glossary = [
 {term:'로컬 (내 컴퓨터)',text:'인터넷이 아니라 지금 쓰는 이 컴퓨터 안을 뜻해요. “로컬 파일”은 내 컴퓨터에 저장된 파일입니다.'},
 {term:'경로',text:'파일이 있는 위치를 글로 적은 것. 예: C:\\Users\\이름\\문서\\codex-실습\\index.html. 파일 탐색기 위쪽 주소 표시줄에서 볼 수 있어요.'},
 {term:'확장자',text:'파일 이름 끝의 .txt, .html, .json 같은 꼬리. 파일 종류를 알려 줍니다.'},
 {term:'첨부',text:'파일을 대화에 넣는 것. 입력창 왼쪽 + 버튼에서 시작해요. 첨부한 파일 이름이 입력창 위에 보이면 성공입니다.'},
 {term:'요청문 (프롬프트)',text:'AI에게 보내는 부탁 글. 이 가이드의 회색 상자에 있는 글을 복사해 그대로 붙여 넣을 수 있어요.'},
 {term:'새 대화',text:'이전 대화와 상관없이 새로 시작하는 대화. 이전 대화는 왼쪽 목록에서 제목을 눌러 다시 열 수 있어요.'},
 {term:'프로젝트',text:'관련 대화·자료·지침을 한 묶음으로 모아 두는 ChatGPT 기능. 왼쪽 목록에서 찾을 수 있어요.'},
 {term:'권한 승인',text:'Codex나 Work가 파일을 만들거나 프로그램을 실행하기 전에 허락을 묻는 창. 허용해도 되는 것과 멈출 것의 기준은 문제 해결의 “권한을 허용해 달라고 멈춰 있어요”에 있어요.'},
 {term:'브라우저 저장 공간',text:'웹페이지가 내 브라우저 안에 자료를 저장하는 곳. 다른 기기와 자동으로 동기화되지 않고, 브라우저 데이터를 지우면 사라져요.'},
 {term:'백업 (JSON)',text:'자료를 파일로 내보내 보관한 것. JSON은 자료를 보관하는 글자 형식의 이름이며 내용을 직접 고칠 필요는 없어요.'},
 {term:'HTML · CSS · JavaScript',text:'웹페이지를 이루는 세 가지 파일 종류. HTML은 내용, CSS는 모양, JavaScript는 동작을 맡아요.'},
 {term:'실행',text:'만든 앱을 열어 실제로 써 보는 것. 이 가이드의 수업 운영 보드는 HTML 파일을 더블클릭하면 브라우저에서 실행돼요.'},
 {term:'시크릿 모드',text:'방문 기록과 저장 자료를 남기지 않는 브라우저 창. 브라우저 저장 공간도 창을 닫으면 사라지므로 보드 실습에는 쓰지 않아요.'},
 {term:'배포',text:'내 컴퓨터에만 있던 웹페이지를 인터넷 주소로 공개하는 것.'},
 {term:'저장소 (GitHub)',text:'파일과 변경 이력을 보관하는 GitHub의 폴더. 공개 저장소는 누구나 볼 수 있어요.'},
 {term:'브랜치',text:'저장소 안의 작업 줄기. 처음에는 main 하나만 있고, 이 가이드에서는 main만 사용해요.'},
 {term:'GitHub Pages',text:'GitHub 저장소에 있는 HTML을 웹사이트로 공개해 주는 무료 기능.'},
 {term:'API 키',text:'프로그램이 어떤 서비스에 접속할 때 쓰는 비밀 열쇠 문자열. 공개 파일에 절대 넣지 않아요.'}
];
const faqItems = [
 {id:'work-hidden',group:'시작과 화면',question:'내 화면에는 Work가 안 보여요.',answer:'먼저 사용하는 계정과 앱이 맞는지 확인해 주세요. 기능 제공은 요금제·플랫폼·지역·배포 상태·조직 설정에 따라 다를 수 있습니다. 공식 안내에서 현재 제공 조건을 확인하세요. 오늘은 채팅 실습부터 시작할 수 있습니다. 채팅에서 같은 초안을 만들어 봤더라도 Work 실습을 완료한 것으로 보지는 않아요.',tags:'워크 메뉴 계정 요금제 설치'},
 {id:'screen-different',group:'시작과 화면',question:'설명과 내 화면이 달라요.',answer:'웹·Windows 앱·휴대폰 앱의 메뉴는 다를 수 있습니다. 이 가이드는 Windows 사용자를 기본으로 설명하며, 버튼 위치보다 이름과 역할을 먼저 안내합니다. 기능이 보이지 않으면 무리하게 다른 메뉴를 누르지 말고 계정과 사용 환경을 확인하세요.',tags:'윈도우 화면 버튼 메뉴 버전'},
 {id:'signup',group:'시작과 화면',question:'계정을 어떻게 만드나요?',answer:'chatgpt.com에 접속해 “가입”을 누르고, 이메일 또는 Google·Microsoft·Apple 계정 중 하나로 시작합니다. 이메일로 가입하면 받은 편지함의 인증 메일을 확인한 뒤 이름과 생년월일을 입력해요. 무료로 시작할 수 있고 결제 정보는 필요 없습니다. 화면이 영어로 나오면 설정에서 언어를 한국어로 바꿀 수 있어요. 학교 계정을 쓸 때는 학교의 사용 기준을 먼저 확인하세요.',tags:'가입 회원가입 계정 만들기 로그인 무료 이메일 구글'},
 {id:'file-unreadable',group:'파일과 결과물',question:'파일을 올렸는데 읽지 못했다고 해요.',answer:'내 컴퓨터에서 파일이 정상적으로 열리는지 먼저 확인하세요. 실습 자료실의 작은 TXT 가상 자료로 다시 시작해 보세요. “지금 실제로 읽을 수 있는 자료 이름을 알려 줘”라고 확인하고, 읽지 못한 파일을 읽었다고 가정해 작업을 이어가지 않습니다.',tags:'첨부 업로드 형식 pdf 문서'},
 {id:'no-download',group:'파일과 결과물',question:'문서를 부탁했는데 글만 나왔어요.',answer:'원하는 파일 형식을 명시하고 현재 환경에서 파일을 만들 수 있는지 물어보세요. 지원되지 않으면 받은 본문을 문서 프로그램에 붙여 넣어 편집할 수 있습니다. 파일을 받았을 때도 직접 열어 내용과 페이지 구성을 확인합니다.',tags:'다운로드 docx 결과 파일'},
 {id:'wrong-answer',group:'파일과 결과물',question:'없는 사실을 덧붙였어요.',answer:'“이 내용은 내가 제공하지 않았어. 근거를 알려주고, 근거가 없으면 확인 필요 항목으로 옮겨 줘”라고 요청하세요. AI가 다시 검토한 답만 믿지 말고 날짜·숫자·장소는 원본과 대조합니다.',tags:'환각 틀린 답변 출처 검토'},
 {id:'app-not-running',group:'Codex와 수업 운영 보드',question:'보드 파일을 열었는데 화면이 안 나와요.',answer:'이 가이드의 보드는 HTML 파일 하나라서 파일 탐색기에서 더블클릭하면 브라우저에서 열립니다. 브라우저가 아닌 다른 프로그램이 열리면 파일을 오른쪽 클릭 → 연결 프로그램 → Edge나 Chrome을 고르세요. 주소창에 file:///로 시작하는 주소가 보이는 것이 정상이에요. 화면이 비어 있으면 F5로 새로고침하고, 그래도 안 되면 Codex에 “index.html을 더블클릭해도 화면이 비어 있어. 원인을 찾아 고쳐 줘”라고 파일 이름과 함께 알려 주세요. Codex가 localhost 같은 실행 주소를 알려 줬다면 “설치나 서버 없이 더블클릭으로 열리게 만들어 줘”라고 다시 요청합니다.',tags:'실행 오류 localhost 열리지 않음 더블클릭 연결 프로그램 빈 화면'},
 {id:'lost-data',group:'Codex와 수업 운영 보드',question:'다른 컴퓨터에서 수업이 안 보여요.',answer:'완성 예시는 현재 브라우저에 수업을 저장합니다. 자동으로 다른 컴퓨터와 동기화되지 않습니다. 원래 컴퓨터에서 ‘백업 다운로드’를 누르고, 다른 컴퓨터에서 ‘백업 불러오기’로 옮기세요. 브라우저 데이터를 지우기 전에도 백업합니다.',tags:'저장 사라짐 새로고침 백업 복원 동기화'},
 {id:'permissions',group:'Codex와 수업 운영 보드',question:'권한을 허용해 달라고 멈춰 있어요.',answer:'창에 적힌 대상 파일·폴더와 하려는 행동을 먼저 읽어 보세요.\n허용해도 되는 요청: 실습 폴더 안에서 파일을 만들거나 고치기, 내가 준 가상 자료 읽기, 결과 파일 만들기, 실습 폴더 안에서 앱 실행하기.\n멈추고 확인할 요청: 프로그램 설치, 실습 폴더 밖 파일 접근, 파일·폴더 삭제, 외부 사이트 연결·공유·발송, 로그인 정보 입력.\n판단이 어려우면 “무엇을 바꾸려는지, 기존 파일에 어떤 영향이 있는지 쉬운 말로 설명해 줘”라고 물은 뒤 정합니다. 실습은 비어 있는 실습 폴더에서 시작하고, 허용 범위를 무조건 넓히지 않아요.',tags:'권한 승인 permission 허용 거부 설치'},
 {id:'codex-install',group:'Codex와 수업 운영 보드',question:'Codex는 어디서 설치하나요?',answer:'이 가이드는 Windows 데스크톱 앱을 기준으로 합니다. 공식 시작 안내에서 설치 파일을 받아 설치하고, 사용하던 ChatGPT 계정으로 로그인한 뒤 제품 선택에서 Codex를 고릅니다. 화면별 순서는 Codex 1편 “작업 위치 확인”에 있어요. 설치가 막히면 공식 안내의 최신 조건(요금제·운영체제)을 확인하세요.',tags:'설치 다운로드 앱 데스크톱 시작 코덱스'},
 {id:'progress',group:'이 가이드 이용하기',question:'완료 표시와 이어보기는 어디에 저장되나요?',answer:'이 가이드를 여는 현재 브라우저에 저장됩니다. 회원가입이나 서버 전송은 없습니다. 다른 기기·브라우저에서는 이어지지 않으며, 브라우저 데이터를 지우면 초기화될 수 있습니다. 공통 입문 4편, 채팅 8편, Work 8편, Codex 10편, 총 30편에 완료 표시가 제공됩니다.',tags:'진도 기록 학습 완료 개인정보'},
 {id:'planned',group:'이 가이드 이용하기',question:'30편을 모두 볼 수 있나요?',answer:'공통 입문 4편, 채팅 8편, Work 8편, Codex 10편을 모두 볼 수 있습니다. 학습 지도에서 원하는 주제를 선택하세요. 실제 AI 기능은 계정과 사용 환경에 따라 다를 수 있습니다.',tags:'페이지 준비 개발 목차'}
];
const courses = [
 {key:'start',title:'공통 입문 · 처음 오셨나요?'},
 {key:'chat',title:'ChatGPT 채팅 · 같이 생각하기'},
 {key:'work',title:'ChatGPT Work · 일 맡기기'},
 {key:'codex',title:'Codex · 내 도구 만들기'}
].map(g=>({...g,items:order[g.key]}));
function card(key,i) {
 const config={chat:['chat','같이 생각하기','질문하고, 글을 다듬고, 아이디어를 정리해요. 익숙한 대화로 첫걸음을 시작합니다.','안내문 초안 다듬기'],work:['work','일 맡기기','자료와 목표를 전달하고 결과물을 받아요. 반복되는 문서 업무를 함께 해결합니다.','공개수업 안내자료 만들기'],codex:['code','내 도구 만들기','필요한 도구를 만들고, 고치고, 다시 써요. 코딩이 처음이어도 차근차근 함께합니다.','나만의 수업 운영 보드']}[key];
 const first=order[key][0],done=order[key].filter(k=>progress.completed.includes(k)).length;
 return `<a class="path-card ${key}" href="#/lesson/${first}"><div class="card-top"><span class="icon-tile">${icon(config[0])}</span><span class="card-number">PATH 0${i+1} · ${order[key].length}편</span></div><div class="product-name">${names[key]}</div><h3>${config[1]}</h3><p>${config[2]}</p><div class="card-example"><span>대표 실습 · ${config[3]}</span>${icon('arrow')}</div><div class="card-footer"><span class="badge">첫 편 · 약 ${lessons[first]?.minutes || 10}분</span>${done?`<span>✓ ${done}/${order[key].length} 완료</span>`:''}<span class="card-first">${esc(lessons[first]?.title || '')}</span></div></a>`;
}
function home() {
 return `<div class="container"><section class="home-hero"><div><div class="eyebrow">선생님의 일상에, AI 한 걸음</div><h1>처음이라도 괜찮아요.<br>하나씩, <em>내 것으로.</em></h1><p class="hero-desc">질문을 나누는 채팅부터, 일을 맡기는 Work,<br>나만의 도구를 만드는 Codex까지.<br>어려운 용어보다 직접 해보는 경험으로 배워요.</p><div class="button-row"><a class="button primary" href="#/start">15분, 가볍게 시작하기 ${icon('arrow')}</a><a class="button" href="#/courses">전체 학습 지도</a></div><p class="hero-foot">${icon('check')} 가이드 회원가입 없이 · 필요한 만큼 · 내 속도로</p></div><div class="hero-visual" role="img" aria-label="완성 예시 수업 운영 보드의 개념 그림. 실제 ChatGPT 화면이 아닙니다."><div class="mini-window"><div class="window-top"><i></i><i></i><i></i><span>나의 수업 운영 보드</span></div><div class="mini-body"><div class="mini-label"><span>3학년 · 과학</span><span>준비 완료</span></div><h3>자석의 성질을 탐구해요</h3><p>오늘 수업도, 나만의 흐름으로.</p><div class="mini-activity"><b>01</b><span>생각 열기</span><small>5분</small></div><div class="mini-activity current"><b>02</b><span>모둠별 탐구 활동</span><small>25분</small></div><div class="mini-activity"><b>03</b><span>배움 정리하기</span><small>10분</small></div></div></div><div class="float-note note-one">${icon('code')} 아이디어가 내 도구로</div><div class="float-note note-two">${icon('check')} 작은 성공부터 차근차근</div><span class="visual-caption">Codex 실습 결과물 · 개념 미리보기</span></div></section>
 ${progressBanner()}
 ${foundationRoute()}<section class="learning-section"><div class="section-top"><div><h2>오늘, 무엇을 해볼까요?</h2><p>입문 4편 다음에는 세 경로 중 지금 필요한 것을 고르세요. 각 경로는 첫 편부터 순서대로 이어집니다.</p></div><a class="text-link" href="#/courses">30편 전체 보기 ${icon('arrow')}</a></div><div class="path-grid">${pathKeys.map(card).join('')}</div><div class="start-strip"><span class="strip-icon">${icon('leaf')}</span><div><h3>아직 무엇부터 할지 모르겠다면</h3><p>채팅으로 안내문 한 편을 다듬어 보세요. 첫 질문은 완벽하지 않아도 괜찮아요.</p></div><a href="#/lesson/chat" class="text-link">첫 실습 시작 ${icon('arrow')}</a></div></section>
 <section class="section-tools"><div class="tool-grid"><a class="tool-link" href="#/resources">${icon('folder')}<div><h3>실습 자료, 여기 모아 두었어요</h3><p>가상 자료와 점검표를 준비하고 시작하세요.</p></div><span class="arrow">↗</span></a><a class="tool-link" href="#/help">${icon('help')}<div><h3>잠깐, 여기서 막혔나요?</h3><p>화면이 다르거나 결과가 이상할 때 찾아보세요.</p></div><span class="arrow">↗</span></a></div></section><aside class="teacher-note"><span class="avatar">G</span><div><strong>G쌤의 한마디</strong><p>모든 기능을 한 번에 알 필요는 없어요. 오늘 필요한 일 하나를 해보고,<br>다음에 또 필요할 때 돌아오세요. 이 가이드가 옆에서 도와드릴게요.</p></div></aside></div>`;
}
function progressBanner() {
 if(!progress.completed.length&&!progress.last) return '';
 const next=nextLesson(),done=progress.completed.length;
 return `<section class="progress-banner" aria-label="학습 진행"><div class="progress-text"><strong>${done?'다시 오셨네요.':'이어서 볼까요?'}</strong> ${next?`다음 학습은 <b>${esc(names[next])}</b>이에요.`:'30편을 모두 마쳤어요. 필요한 편을 다시 찾아보세요.'}</div><div class="progress-track" aria-label="전체 학습 ${done}개 완료"><span style="width:${done/keys.length*100}%"></span></div><span class="progress-count">${done}/${keys.length} 완료</span>${next?`<a class="button primary small" href="#/lesson/${next}">${esc(names[next])} 시작 ${icon('arrow')}</a>`:`<a class="button small" href="#/courses">학습 지도 보기 ${icon('arrow')}</a>`}${progress.last&&progress.last!==next&&!progress.completed.includes(progress.last)?`<a class="text-link" href="#/lesson/${progress.last}">마지막으로 본 ${esc(names[progress.last])} →</a>`:''}</section>`;
}
function heading(eyebrow,title,description) {return `<header class="page-heading"><div class="eyebrow">${esc(eyebrow)}</div><h1>${esc(title)}</h1><p>${esc(description)}</p></header>`;}
function foundationRoute() {
 return '<section class="course-group foundation-route"><h2>기초부터 차근차근 · 공통 입문 4편</h2><p class="foundation-intro">각 5~8분, 내게 필요한 곳부터 시작해도 좋아요. 읽고 직접 확인한 뒤 완료를 표시해 보세요.</p>'+foundationKeys.map((key,i)=>`<a class="course-row published" href="#/lesson/${key}"><span class="order">0${i+1}</span><span>${esc(lessons[key].title)}</span><span class="badge ready">${progress.completed.includes(key)?'✓ 완료':'약 '+lessons[key].minutes+'분 →'}</span></a>`).join('')+'</section>';
}
function startPage() {
 return `<div class="container page-bottom">${heading('YOUR FIRST STEP','15분, 첫 성공을 만들어 볼까요?','처음 5분은 차이를 이해하고, 다음 10분은 안내문 한 편을 다듬어 봅니다.')}<div class="intro-grid"><div class="intro-card"><span class="icon-tile">${icon('chat')}</span><h2>채팅은 대화하며</h2><p>생각을 정리하고 글을 다듬어요. 답을 보고 다시 부탁하면서 원하는 방향을 찾습니다.</p></div><div class="intro-card"><span class="icon-tile">${icon('work')}</span><h2>Work는 목표를 맡겨</h2><p>자료와 완료 조건을 주고 검토할 결과물을 받아요. 문서 작업과 자료 분석부터 시작해 봅니다.</p></div><div class="intro-card"><span class="icon-tile">${icon('code')}</span><h2>Codex는 만들고 고쳐</h2><p>작동하는 도구를 만들고 발전시켜요. 파일과 실행 결과를 확인하는 경험을 익힙니다.</p></div></div><div class="info-note">세 경로는 배우기 쉬운 출발점이에요. 기능은 서로 겹칩니다. Work에서도 프로그램 관련 일을 할 수 있고, Codex로 문서를 만들 수도 있어요. <a href="https://learn.chatgpt.com/docs/use-chatgpt" target="_blank" rel="noopener noreferrer">공식 설명 확인 ↗</a></div>${foundationRoute()}<h2>바로 해보고 싶다면 · 첫날에는 여기까지만</h2><ol class="step-route"><li><span class="step-num">01</span><div><h3>내가 원하는 결과를 골라요 <span class="badge">2분</span></h3><p>오늘은 ‘학부모가 읽기 편한 안내문’을 목표로 정합니다.</p></div></li><li><span class="step-num">02</span><div><h3>ChatGPT를 열고 준비해요 <span class="badge">3분</span></h3><p>본인 계정으로 로그인하고 새 채팅을 여세요. 학생 개인정보는 필요하지 않아요.</p></div><a class="button small" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">ChatGPT 열기 ↗</a></li><li><span class="step-num">03</span><div><h3>초안을 받고 한 번 고쳐요 <span class="badge">10분</span></h3><p>예시를 복사하고, 사실을 확인하고, 길이를 줄이는 실습입니다.</p></div><a class="button primary small" href="#/lesson/chat">안내문 실습 ${icon('arrow')}</a></li></ol><aside class="teacher-note"><span class="avatar">G</span><div><strong>시작 전 확인</strong><p>이 사이트는 학습 안내서입니다. AI가 실행되는 곳은 ChatGPT 또는 Codex예요. 실습 가능한 기능은 계정과 사용 환경에 따라 달라질 수 있습니다. 기본 안내는 Windows 기준이며 Mac에서는 메뉴가 다를 수 있어요.</p></div></aside><h2>다른 도구로 넓혀 보기</h2><p class="section-note">각 경로는 첫 편부터 순서대로 이어집니다. 전체 30편은 <a href="#/courses">학습 지도</a>에 있어요.</p><div class="tool-grid"><a href="#/lesson/${order.work[0]}" class="tool-link">${icon('work')}<div><h3>자료로 결과물 만들기</h3><p>안내문에서 배포용 안내자료로 넓혀 보세요.</p></div><span class="arrow">→</span></a><a href="#/lesson/${order.codex[0]}" class="tool-link">${icon('code')}<div><h3>나의 수업 도구 만들기</h3><p>수업 순서와 자료를 운영 보드로 모아 보세요.</p></div><span class="arrow">→</span></a></div></div>`;
}
function coursesPage() {
 const next=nextLesson();
 return `<div class="container page-bottom">${heading('LEARNING MAP','내 속도로 따라가는 학습 지도','공통 입문부터 순서대로 배우거나, 지금 필요한 편으로 바로 이동하세요. 각 경로는 준비편이 먼저, 실습이 그다음입니다.')}<div class="info-note">현재 <strong>공통 입문 4편 + 채팅 8편 + Work 8편 + Codex 10편, 총 30편</strong>을 이용할 수 있습니다. 완료 표시와 다음 추천은 이 브라우저의 학습 기록을 따릅니다.</div><div class="course-tabs" role="group" aria-label="학습 경로 필터">${[['all','전체'],['start','처음 시작'],...pathKeys.map(k=>[k,names[k]])].map(([k,n])=>`<button data-filter="${k}" class="${k==='all'?'active':''}" aria-pressed="${k==='all'}">${n}</button>`).join('')}</div>${courses.map(g=>`<section class="course-group" data-group="${g.key}"><h2>${g.title} <span class="badge">${g.items.length}개 주제</span></h2>${g.items.map((key,i)=>{const done=progress.completed.includes(key),isNext=key===next;return `<a href="#/lesson/${key}" class="course-row published${done?' done':''}${isNext?' next':''}"><span class="order">${String(i+1).padStart(2,'0')}</span><span>${esc(lessons[key].title)}</span><span class="row-minutes">약 ${lessons[key].minutes}분</span><span class="badge ${done?'ready':isNext?'next':''}">${done?'✓ 완료':isNext?'다음 추천 →':(g.key==='start'?'학습하기 →':'실습하기 →')}</span></a>`;}).join('')}</section>`).join('')}</div>`;
}
/* 자료실: 처음 두 파일(계획서·준비 메모)이 채팅·Work 실습 대부분의 출발점이므로 맨 위에 따로 보여 주고, 나머지는 과정별로 묶는다. */
const resources = [
 {group:'starter',title:'공개수업 가상 계획서',description:'일정·장소·수업 흐름이 정리된 자료예요. 파일 질문·프로젝트·Work 실습이 이 파일로 시작합니다.',file:'2026-09-20-공개수업-계획.txt',meta:'TXT · 가상 자료 · 3학년 과학'},
 {group:'starter',title:'공개수업 준비 메모',description:'내부 준비 사항과 미확정 정보가 섞여 있어요. 계획서와 함께 첨부해 학부모에게 전달할 정보와 구분해 보세요.',file:'2026-09-20-공개수업-메모.txt',meta:'TXT · 가상 자료 · 교사용'},
 {group:'chat',title:'채팅 활용 기록표',description:'후속 요청·네 가지 단서·이미지 대조·수업 적용을 기록합니다.',file:'2026-09-22-채팅활용-기록표.md',meta:'Markdown · 채팅 과정 실습'},
 {group:'chat',title:'사진 질문용 가상 일정',description:'HTML을 브라우저로 열고 일정 카드만 캡처해 이미지 질문에 사용하세요.',file:'2026-09-22-사진질문-연습화면.html',meta:'HTML · 가상 일정 화면'},
 {group:'work',title:'탐구 준비물 가상 비교자료',description:'세 가지 가상 공급안의 비용과 미확정 조건을 비교합니다. 실제 견적이나 구매 추천 자료가 아닙니다.',file:'2026-09-21-탐구준비물-비교자료.csv',meta:'CSV · Work 비교·분석 실습'},
 {group:'work',title:'공개수업 검토용 초안',description:'연습을 위해 오류를 넣은 초안입니다. 계획·메모와 대조하고 고쳐 보세요. 실제 배포 금지.',file:'2026-09-21-공개수업-검토용초안.txt',meta:'TXT · 의도적 오류가 있는 가상 자료'},
 {group:'work',title:'Work 결과 검토표',description:'분석의 계산·미정 조건과 문서의 원본 근거를 직접 확인하는 점검표입니다.',file:'2026-09-21-Work-결과검토표.md',meta:'Markdown · 메모장으로 열 수 있어요'},
 {group:'work',title:'Work 작업설계표',description:'작업 환경·자료·완료 조건·방향 변경·재사용을 기록합니다.',file:'2026-09-22-Work-작업설계표.md',meta:'Markdown · Work 실습'},
 {group:'codex',title:'Codex 준비 점검표',description:'실습 폴더·파일·브라우저 저장 자료를 구분하고 실행 결과를 기록합니다.',file:'2026-09-21-Codex-준비점검표.md',meta:'Markdown · 시작 위치와 실행 확인'},
 {group:'codex',title:'Codex 실습 기록표',description:'기획의 완료 조건, 오류 재현 기록, 공개 전후 점검을 한 장의 기록으로 이어갑니다.',file:'2026-09-21-Codex-실습기록표.md',meta:'Markdown · 기획·수정·배포 기록'},
 {group:'codex',title:'Codex 수정·복원 기록표',description:'작은 변경의 영향과 코드·수업 데이터 복원 결과를 따로 기록합니다.',file:'2026-09-21-Codex-수정복원기록표.md',meta:'Markdown · 변경 검토와 복원 확인'},
 {group:'common',title:'결과물 확인 체크리스트',description:'안내문과 운영 보드를 사용하기 전에 직접 확인할 항목을 모았습니다.',file:'2026-09-20-실습-체크리스트.md',meta:'Markdown · 메모장으로 열 수 있어요'}
];
const resourceGroups=[['chat','ChatGPT 채팅'],['work','ChatGPT Work'],['codex','Codex'],['common','공통']];
function resourcesPage() {
 const card=r=>`<article class="resource-card">${icon('download')}<h2>${r.title}</h2><p>${r.description}</p><div class="file-meta">${r.meta}</div><a class="button small" href="./${encodeURIComponent(r.file)}" download="${r.file}">자료 내려받기 ${icon('download')}</a></article>`;
 const starters=resources.filter(r=>r.group==='starter');
 const example=`<article class="resource-card">${icon('code')}<h2>수업 운영 보드 완성 예시</h2><p>수업 만들기·활동 편집·진행 화면·저장·백업을 직접 경험해 보세요. Codex 준비 3편과 수정·복원 3편은 이 파일로 연습합니다.</p><div class="file-meta">브라우저에서 실행 · 개인정보 입력 없이</div><a class="button small" href="./2026-09-20-classroom-board.html" target="_blank" rel="noopener noreferrer">완성 예시 열기 ↗</a><p><a class="button small" href="./2026-09-20-classroom-board.html" download="2026-09-20-classroom-board.html">실습용 HTML 내려받기</a></p></article>`;
 return `<div class="container page-bottom">${heading('PRACTICE KIT','연습할 자료부터 준비해요','실제 학생 정보 없이도 충분히 실습할 수 있도록 가상 자료를 준비했습니다.')}<section class="starter-files" aria-labelledby="starter-title"><div><span class="badge ready">처음이면 이 두 파일</span><h2 id="starter-title">계획서와 준비 메모부터 받아 두세요</h2><p>파일 질문, 프로젝트, Work 첫 실습이 모두 이 두 파일을 씁니다. 학생 정보가 없는 가상 자료이고, 다운로드 폴더에 저장돼요.</p></div><div class="button-row">${starters.map(r=>`<a class="button primary" href="./${encodeURIComponent(r.file)}" download="${r.file}">${r.title} ${icon('download')}</a>`).join('')}</div></section><div class="resource-grid">${resourceGroups.map(([g,label])=>`<h2 class="resource-group">${label}</h2>`+resources.filter(r=>r.group===g).map(card).join('')+(g==='codex'?example:'')).join('')}</div><div class="info-note">다운로드한 자료는 모두 실습을 위해 만든 가상 내용입니다. 실제 학부모 안내문으로 그대로 사용하지 마세요. 파일 질문·프로젝트·Work 실습에서는 계획서와 준비 메모 두 파일을 함께 사용합니다.</div><h2>자료를 받았다면</h2><div class="button-row"><a class="button" href="#/lesson/files">파일 질문부터 연습하기 →</a><a class="button" href="#/lesson/projects">프로젝트로 모아 쓰기 →</a><a class="button primary" href="#/lesson/environment">Work 과정 시작 ${icon('arrow')}</a><a class="button" href="#/lesson/workspace">Codex 과정 시작</a></div></div>`;
}
function helpPage() {
 return `<div class="container page-bottom">${heading('WHEN YOU GET STUCK','막혔을 때, 여기서 다시 시작해요','처음부터 다시 할 필요는 없어요. 지금 겪는 상황과 가장 가까운 항목을 골라 보세요.')}<div class="button-row" style="margin-bottom:27px"><button class="button" data-search>${icon('help')} 증상이나 오류로 검색</button><a class="button" href="#/help?section=glossary">${icon('book')} 용어 사전</a><a class="text-link" href="https://learn.chatgpt.com/docs/use-chatgpt" target="_blank" rel="noopener noreferrer">공식 사용 안내 ↗</a></div>${[...new Set(faqItems.map(f=>f.group))].map(g=>`<section class="faq-group"><h2>${g}</h2>${faqItems.filter(f=>f.group===g).map(f=>`<details class="faq" id="faq-${f.id}"><summary>${f.question}</summary><p>${f.answer}</p></details>`).join('')}</section>`).join('')}<section id="glossary" class="glossary anchor-section" aria-labelledby="glossary-title"><h2 id="glossary-title">용어 사전</h2><p class="section-note">본문에서 처음 만나는 말을 한 줄씩 풀었어요. 검색창에 용어를 입력해도 이곳으로 옵니다.</p><dl>${glossary.map(g=>`<div><dt>${esc(g.term)}</dt><dd>${esc(g.text)}</dd></div>`).join('')}</dl></section><aside class="teacher-note"><span class="avatar">G</span><div><strong>오류를 설명하는 세 문장</strong><p>“이 순서로 눌렀어요. 이렇게 될 줄 알았어요. 실제로는 이렇게 나왔어요.”<br>이 세 가지를 함께 알려주면 수정할 곳을 찾기 쉬워집니다.</p></div></aside></div>`;
}
function lessonPage(key) {
 const l=lessons[key];if(!keys.includes(key)||!l)return notFound();
 progress.last=key;saveProgress();
 const pos=position(key),at=keys.indexOf(key),prevKey=keys[at-1],nextKey=keys[at+1];
 return `<div class="lesson-shell"><aside class="lesson-sidebar"><p class="sidebar-title">작은 성공부터, 차근차근</p><a class="sidebar-link" href="#/start">${icon('leaf')} 처음 시작하기</a>${['start',...pathKeys].map(g=>`<p class="sidebar-group">${groupNames[g]}</p>`+order[g].map(k=>`<a class="sidebar-link ${k===key?'active':''}" href="#/lesson/${k}" ${k===key?'aria-current="page"':''}>${icon(foundationKeys.includes(k)?'book':k==='codex'?'code':k)}${names[k]} ${progress.completed.includes(k)?'✓':''}</a>`).join('')).join('')}<a class="sidebar-link" href="#/resources">${icon('folder')} 실습 자료</a><a class="sidebar-link" href="#/help">${icon('help')} 문제 해결</a><div class="sidebar-note">전체 학습 ${progress.completed.length}/${keys.length} 완료<br>학습 기록은 이 브라우저에<br>저장됩니다.</div></aside><article class="lesson-article"><div class="breadcrumb"><a href="#/">홈</a><span>/</span><a href="#/courses">학습 과정</a><span>/</span><span>${names[key]}</span></div><div class="eyebrow">${esc(l.eyebrow)}</div><h1 class="lesson-title">${esc(l.title)}</h1><p class="lesson-summary">${esc(l.summary)}</p><div class="lesson-meta"><span class="badge">${pos.label} ${pos.index}/${pos.total}</span><span>약 ${l.minutes}분</span><span>Windows 기본 안내</span><span>${esc(l.checkedDate || '2026-09-20')} 확인</span></div><div class="outcome"><strong>오늘의 완성 목표</strong><p>${esc(l.outcome)}</p></div>
 ${key==='codex'?`<aside class="demo-banner"><strong>먼저 완성 모습을 경험해 보세요</strong><p>수업을 복제하고, 활동을 옮기고, 진행 화면을 열어 보세요. 직접 만들 도구가 한결 선명해집니다.</p><a class="button small" href="./2026-09-20-classroom-board.html" target="_blank" rel="noopener noreferrer">수업 운영 보드 열기 ↗</a></aside>`:''}
 <section id="prepare" class="anchor-section"><h2>시작 전에 준비해요</h2><ul>${l.prerequisites.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>${key==='work'?'<a class="button small" href="#/resources">실습 자료 받으러 가기 →</a>':''}${key==='codex'?'<p class="source-caption">Codex를 처음 여는 경우 <a href="https://learn.chatgpt.com/docs/quickstart" target="_blank" rel="noopener noreferrer">공식 시작 안내</a>에서 현재 설치·로그인 방법을 확인하세요. 계정과 앱에 따라 선택 화면이 다를 수 있습니다.</p>':''}</section><section id="practice" class="anchor-section"><h2>직접 해봅시다</h2>${l.steps.map((s,i)=>`<section class="lesson-step" id="step-${i+1}"><div class="step-heading"><span class="number">${i+1}</span><h3>${esc(s.title.replace(/^\d+\.\s*/,''))}</h3></div><p>${esc(s.text)}</p>${s.links?.length?`<div class="button-row">${s.links.map(link=>{const external=!link.url.startsWith('#');return `<a class="button small" href="${esc(link.url)}" ${external?'target="_blank" rel="noopener noreferrer"':''}>${esc(link.label)} ${external?'↗':'→'}</a>`;}).join('')}</div>`:''}${s.prompt?`<div class="prompt-box"><div class="prompt-top"><span>${esc(s.promptLabel||'이렇게 말해보세요')}</span><button class="copy-button" data-copy="${key}:${i}">${icon('copy')} 복사</button></div><pre>${esc(s.prompt)}</pre></div>`:''}</section>`).join('')}</section><section id="success" class="anchor-section"><h2>이렇게 나오면 성공입니다</h2><ul class="success-list">${l.checks.map(c=>`<li>${icon('check')}<span>${esc(c)}</span></li>`).join('')}</ul></section><section id="trouble" class="anchor-section"><h2>잘 안 된다면</h2>${l.troubleshooting.map(f=>`<details class="faq"><summary>${esc(f.question)}</summary><p>${esc(f.answer)}</p></details>`).join('')}</section><section id="tip" class="anchor-section"><h2>G쌤 팁</h2><p>${esc(l.tip)}</p></section><div class="sources">공식 근거 · 화면과 제공 기능은 업데이트될 수 있어요.<br>${l.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`).join('')}</div><div class="complete-panel"><div><strong>직접 해보셨나요?</strong><p>결과를 확인했다면 학습 기록을 남겨 주세요.</p></div><button class="button primary" data-complete="${key}" aria-pressed="${progress.completed.includes(key)}">${progress.completed.includes(key)?'✓ 학습 완료 · 취소':'완료로 표시'}</button></div><nav class="lesson-nav" aria-label="이전 다음 학습"><a class="nav-button prev" href="${prevKey?`#/lesson/${prevKey}`:'#/start'}"><small>이전</small><span>${prevKey?names[prevKey]:'처음 시작하기'}</span></a><a class="nav-button next" href="${nextKey?`#/lesson/${nextKey}`:'#/courses'}"><small>다음</small><span>${nextKey?names[nextKey]:'전체 학습 지도'}</span></a></nav></article><aside class="lesson-toc"><p>이 페이지에서</p>${[['prepare','시작 전 준비'],['practice','직접 해봅시다'],['success','성공 기준'],['trouble','잘 안 된다면'],['tip','G쌤 팁']].map(([id,t])=>`<a href="#/lesson/${key}?section=${id}" data-scroll="${id}">${t}</a>`).join('')}<p class="tip-small">예시 요청문은 출발점이에요.<br>나의 상황에 맞춰<br>조금씩 바꿔 보세요.</p></aside></div>`;
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
 const root=document.documentElement,previous=root.style.scrollBehavior;root.style.scrollBehavior='auto';window.scrollTo(0,0);root.style.scrollBehavior=previous||'';main.focus({preventScroll:true});
 if(params.has('faq')){const item=document.getElementById('faq-'+params.get('faq'));if(item){item.open=true;requestAnimationFrame(()=>item.scrollIntoView({block:'center'}));}}
 if(params.has('section')){const item=document.getElementById(params.get('section'));if(item)requestAnimationFrame(()=>item.scrollIntoView());}
 if(!storageOK)warnStorage();
}
const searchDialog=$('#search-dialog');
const searchData=[...keys.filter(k=>lessons[k]).map(k=>({title:lessons[k].title,category:names[k],group:groupNames[groupOf(k)],url:`#/lesson/${k}`,body:[names[k],groupNames[groupOf(k)],lessons[k].title,lessons[k].summary,...lessons[k].steps.map(s=>s.text+' '+(s.prompt||'')),...lessons[k].troubleshooting.map(t=>t.question+' '+t.answer)].join(' ')})),...faqItems.map(f=>({title:f.question,category:'문제 해결',url:`#/help?faq=${f.id}`,body:f.answer+' '+f.tags})),{title:'용어 사전',category:'문제 해결',url:'#/help?section=glossary',body:glossary.map(g=>g.term+' '+g.text).join(' ')},{title:'실습 자료 내려받기',category:'자료실',url:'#/resources',body:'공개수업 계획서 메모 파일 다운로드 체크리스트 완성 예시'},{title:'15분, 첫 성공을 만들어 볼까요?',category:'처음 시작하기',url:'#/start',body:'처음 차이 계정 시작 채팅 Work Codex'}];
/* 초보자가 실제로 입력하는 말을 사이트 용어로 넓혀 준다. 검색어 한 단어가 아래 후보 중 하나라도 본문에 있으면 맞는 것으로 본다. */
const synonyms={'코덱스':['codex'],'프롬프트':['요청문','요청'],'챗지피티':['chatgpt'],'챗gpt':['chatgpt'],'지피티':['chatgpt'],'gpt':['chatgpt'],'워크':['work'],'업로드':['첨부'],'붙여넣기':['붙여'],'붙여넣':['붙여'],'캡처':['화면','캡처'],'스크린샷':['화면','캡처'],'회원가입':['가입'],'가입':['가입','계정'],'에러':['오류'],'버그':['오류'],'다운로드':['내려받','다운로드'],'다운':['내려받'],'지침':['프로젝트','지침'],'되돌리기':['되돌'],'삭제':['지우','삭제'],'사진':['사진','이미지','화면'],'이미지':['이미지','사진'],'복사':['복사','붙여']};
/* 검색 순위: 경로 이름 일치 3점, 제목 2점, 짧은 이름 1점. 같은 점수면 학습 순서. */
function search(){const query=$('#search-input').value.trim().toLocaleLowerCase();const words=query.split(/\s+/).filter(Boolean);const hit=(text,w)=>[w,...(synonyms[w]||[])].some(v=>text.includes(v));const result=searchData.filter(r=>{const hay=(r.title+' '+r.category+' '+(r.group||'')+' '+r.body).toLocaleLowerCase();return words.every(w=>hit(hay,w));}).map((r,i)=>({r,i,score:words.reduce((s,w)=>s+Math.max(hit((r.group||'').toLocaleLowerCase(),w)?3:0,hit(r.title.toLocaleLowerCase(),w)?2:0,hit(r.category.toLocaleLowerCase(),w)?1:0),0)})).sort((a,b)=>b.score-a.score||a.i-b.i).map(x=>x.r);$('#search-results').innerHTML=result.length?result.slice(0,12).map(r=>`<a class="search-result" href="${r.url}" data-search-result><strong>${esc(r.title)}</strong><small>${esc(r.category)}</small></a>`).join(''):`<p class="search-empty">“${esc(query)}”에 맞는 결과가 없어요.<br>‘파일’, ‘저장’, ‘Work’처럼 짧게 검색해 보세요.</p>`;}
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
 if(target.dataset.complete){const key=target.dataset.complete;const isDone=progress.completed.includes(key);progress.completed=isDone?progress.completed.filter(k=>k!==key):[...progress.completed,key];saveProgress();target.setAttribute('aria-pressed',String(!isDone));target.textContent=isDone?'완료로 표시':'✓ 학습 완료 · 취소';const sidebar=$('.sidebar-note');if(sidebar)sidebar.innerHTML=`전체 학습 ${progress.completed.length}/${keys.length} 완료<br>학습 기록은 이 브라우저에<br>저장됩니다.`;document.querySelectorAll('.lesson-sidebar .sidebar-link').forEach(link=>{const k=link.hash.split('/').pop();if(keys.includes(k))link.innerHTML=icon(foundationKeys.includes(k)?'book':k==='codex'?'code':k)+names[k]+(progress.completed.includes(k)?' ✓':'');});toast(isDone?'완료 표시를 취소했어요.':storageOK?'작은 성공 하나를 기록했어요. 잘하셨어요!':'이 화면에 완료를 표시했어요. 브라우저 저장은 사용할 수 없어요.');}
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
 const note=$('.sidebar-note');if(note)note.innerHTML=`전체 학습 ${progress.completed.length}/${keys.length} 완료<br>학습 기록은 이 브라우저에<br>저장됩니다.`;
 document.querySelectorAll('.lesson-sidebar .sidebar-link').forEach(link=>{const k=link.hash.split('/').pop();if(keys.includes(k))link.innerHTML=icon(foundationKeys.includes(k)?'book':k==='codex'?'code':k)+names[k]+(progress.completed.includes(k)?' ✓':'');});
 window.scrollTo(0,y);
 }catch{toast('다른 탭의 학습 기록을 읽지 못했어요.');}}});
render();
})();
