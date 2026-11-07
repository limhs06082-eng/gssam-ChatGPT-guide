/* 2026-11-07 기능 보강. 공식 문서(learn.chatgpt.com)로 확인한 ChatGPT·Codex 기능 가운데
   기존 30편에 빠져 있던 것을 해당 레슨의 단계·문제 해결로 덧붙인다. 레슨 순서와 편수는 바꾸지 않는다.
   문서로 이름을 확인하지 못한 버튼은 위치와 기능으로만 설명한다. */
(() => {
'use strict';
const L = window.GUIDE_LESSONS || {};
const DATE = '2026-11-07';
const src = {
  use: {label: '공식 사용 안내 · 2026-11-07 확인', url: 'https://learn.chatgpt.com/docs/use-chatgpt'},
  personalize: {label: '공식 맞춤 설정 안내 · 2026-11-07 확인', url: 'https://learn.chatgpt.com/docs/personalize'},
  memories: {label: '공식 메모리 안내 · 2026-11-07 확인', url: 'https://learn.chatgpt.com/docs/customization/memories'},
  search: {label: '공식 웹 검색 안내 · 2026-11-07 확인', url: 'https://learn.chatgpt.com/docs/web-search'},
  viz: {label: '공식 시각화 안내 · 2026-11-07 확인', url: 'https://learn.chatgpt.com/docs/visualizations'},
  agents: {label: '공식 AGENTS.md 안내 · 2026-11-07 확인', url: 'https://learn.chatgpt.com/docs/agent-configuration/agents-md'},
  browser: {label: '공식 내장 브라우저 안내 · 2026-11-07 확인', url: 'https://learn.chatgpt.com/docs/browser'},
  appshots: {label: '공식 Appshots 안내 · 2026-11-07 확인', url: 'https://learn.chatgpt.com/docs/appshots'}
};
const addSource = (lesson, s) => { if (!lesson.sources.some(x => x.url === s.url)) lesson.sources.push(s); };
/* 마무리(기록·보관) 단계는 맨 끝에 두고, 새 단계는 그 바로 앞에 넣는다. */
const beforeLast = (lesson, stepObj) => lesson.steps.splice(Math.max(lesson.steps.length - 1, 0), 0, stepObj);
const renumber = lesson => lesson.steps.forEach((st, i) => { st.title = (i + 1) + '. ' + st.title.replace(/^\d+\.\s*/, ''); });
const touch = (key, extraMinutes, fn) => { const l = L[key]; if (!l) return; fn(l); l.minutes += extraMinutes; l.checkedDate = DATE; renumber(l); };

/* 입문 4편 · 공유 링크와 기록 설정 */
touch('privacy', 4, l => {
  l.steps.push({title: '공유와 기록 설정을 직접 확인해요', text: '대화 공유는 링크를 가진 사람이면 누구나 그 시점의 대화를 볼 수 있는 기능이에요. 프로필 메뉴의 설정에서 데이터 제어(Data controls)를 열고 Shared links를 누르면 지금까지 만든 공유 링크를 보고 지울 수 있습니다. 같은 데이터 제어 화면에는 내 대화를 모델 개선에 쓸지 정하는 설정도 있어요. 항목 이름은 계정에 따라 조금 다르니, 켜져 있는지 꺼져 있는지 직접 보고 학교 기준에 맞게 정하세요. 기록에 남기지 않고 한 번만 물어보는 임시 대화 기능도 화면에 보이면 확인해 둡니다. 설정을 바꿔도 학생 개인정보를 넣지 않는다는 원칙은 그대로예요.', links: [{label: '공식 사용 안내(공유 링크)', url: 'https://learn.chatgpt.com/docs/use-chatgpt'}]});
  l.checks.push('데이터 제어에서 Shared links 목록을 열어 봤고, 모델 개선 설정의 현재 상태를 기록했어요.');
  l.troubleshooting.push({question: '공유 링크를 실수로 만들었어요.', answer: '설정 → 데이터 제어 → Shared links에서 해당 링크를 지우세요. 지운 뒤에는 그 주소로 대화를 볼 수 없습니다. 링크를 보낸 사람이 있다면 이미 본 내용은 되돌릴 수 없으니, 처음부터 가상 자료로만 대화하는 것이 가장 안전해요.'});
  addSource(l, src.use);
});

/* 채팅 2편 · 맞춤 설정과 메모리 */
touch('followup', 5, l => {
  beforeLast(l, {title: '다음 대화에도 지킬 선호는 맞춤 설정·메모리에 남겨요', text: '대화마다 같은 조건을 반복해 쓰고 있다면 맞춤 설정을 써 보세요. 웹에서는 설정 → Personalization → Base style and tone에서 답변의 말투를 고를 수 있어요. 말투만 바뀌고 할 수 있는 일은 그대로입니다. 같은 Personalization 영역의 맞춤 지침(Custom instructions)에는 모든 대화에서 지킬 선호를 적을 수 있고, 메모리도 이곳에서 관리합니다. 아래 요청으로 규칙 하나를 기억시킨 뒤 새 대화에서 가상 안내문을 부탁해 지켜지는지 보세요. 연습이 끝나면 Personalization의 메모리 관리에서 그 항목을 찾아 삭제해 봅니다. 학생 정보나 개인적인 사실은 기억시키지 않아요. 메모리 기능이 보이지 않으면 맞춤 지침에 같은 문장을 적어도 됩니다.', prompt: '앞으로 안내문을 부탁하면, 내가 주지 않은 정보는 지어내지 말고 “확인 필요” 목록으로 따로 적어 줘. 이 규칙을 기억해 줘.', links: [{label: '공식 맞춤 설정 안내', url: 'https://learn.chatgpt.com/docs/personalize'}, {label: '공식 메모리 안내', url: 'https://learn.chatgpt.com/docs/customization/memories'}]});
  l.checks.push('새 대화에서 기억시킨 규칙이 지켜지는 것을 봤고, 연습이 끝난 뒤 그 메모리를 삭제했어요.');
  l.troubleshooting.push({question: '원하지 않는 내용을 기억하고 있어요.', answer: '설정 → Personalization의 메모리 관리에서 해당 항목을 지우세요. 대화 안에서 “방금 기억한 규칙을 잊어 줘”라고 해도 되지만, 실제로 지워졌는지는 관리 화면에서 확인합니다.'});
  addSource(l, src.personalize); addSource(l, src.memories);
});

/* 채팅 6편 · 출처가 많은 조사는 Deep research */
touch('search', 5, l => {
  beforeLast(l, {title: '출처가 많은 조사는 Deep research로 맡겨 봐요', text: '여러 자료를 모아 보고서로 받고 싶을 때는 Work로 바꾼 뒤 입력창의 + 메뉴에서 Deep research를 고릅니다. 계정에 따라 메뉴가 없을 수 있어요. 보고서가 길어도 확인 방법은 같습니다. 출처 세 개 이상을 직접 열어 보고서의 문장과 맞춰 보고, 확인한 날짜를 기록하세요. 메뉴가 없으면 지금까지처럼 채팅에서 출처를 하나씩 확인하면 됩니다.', prompt: '초등 3학년 “자석의 성질” 수업에 쓸 수 있는 공공기관·과학관의 실험 자료를 조사해 줘. 각 자료의 기관명, 링크, 안전 주의점을 표로 정리하고, 확인하지 못한 내용은 따로 표시해 줘. 학생 개인정보는 필요 없어.', links: [{label: '공식 웹 검색 안내(Deep research)', url: 'https://learn.chatgpt.com/docs/web-search'}]});
  l.checks.push('Deep research 보고서(또는 채팅 검색 결과)의 출처 세 개를 직접 열어 대조했어요.');
  l.tip = l.tip.replace(/ 여러 출처를 조사한 보고서가 필요해지면[^]*?같습니다\./, '');
  addSource(l, src.search);
});

/* 채팅 8편 · 학생 입장에서 질문으로 이끄는 대화 (플래시카드 다음, 마무리 기록 앞) */
touch('teaching', 5, l => {
  const at = l.steps.findIndex(st => /적용 여부/.test(st.title));
  l.steps.splice(at < 0 ? l.steps.length : at, 0, {title: '학생 입장에서 질문으로 이끄는 대화를 시험해요', text: '수업에 AI를 보여 주기 전에, 학생이 쓰면 어떤 대화가 될지 교사가 먼저 시험해 봅니다. 새 대화에서 아래 요청을 보내고, 답을 바로 알려 주는지 질문으로 생각을 이끄는지 관찰하세요. 도구 메뉴에 학습용 모드가 보이면 켜고 같은 질문을 다시 보내 두 결과를 비교합니다. 모드 이름과 제공 여부는 계정에 따라 달라요. 실제 학생에게 쓰게 할지는 학교의 이용 기준과 연령 조건을 확인한 뒤 정합니다.', prompt: '나는 초등학교 3학년 학생이야. 자석에 붙는 물체와 붙지 않는 물체를 어떻게 구분하는지 배우고 싶어. 답을 바로 말하지 말고, 내가 생각해 볼 수 있게 한 번에 질문 하나씩 해 줘.'});
  l.checks.push('답을 바로 주는 대화와 질문으로 이끄는 대화의 차이를 기록했어요.');
});

/* Work 5편 · 비교표를 그래프로 확인 (@Visualize) */
touch('compare', 5, l => {
  const at = l.steps.findIndex(st => /보관/.test(st.title));
  l.steps.splice(at < 0 ? l.steps.length : at, 0, {title: '가능하면 그래프로도 확인해요', text: '입력창에 @를 입력하고 Visualize를 찾아 Plugins 아래의 Visualize를 고르면, 표를 그래프나 작은 대화형 도구로 만들 수 있어요. 미리보기 기능이라 계정·앱에 따라 보이지 않을 수 있고, 데스크톱 앱에 없으면 웹에서 해 봅니다. 그래프의 값은 3단계에서 직접 계산한 값과 반드시 맞춰 보세요. 보이지 않으면 이 단계는 건너뛰어도 됩니다.', prompt: '@Visualize 첨부한 가상 준비물 비교자료로 A·B·C 공급안의 총액을 막대그래프로 만들어 줘. 미확정인 배송비는 “미정”으로 구분해 표시하고, 그래프 아래에 표로도 요약해 줘.', links: [{label: '공식 시각화 안내', url: 'https://learn.chatgpt.com/docs/visualizations'}]});
  l.checks.push('그래프(만들었다면)의 막대 값이 직접 계산한 총액과 같고, 미정 항목이 구분돼 있어요.');
  addSource(l, src.viz);
});

/* Codex 5편 · AGENTS.md로 폴더 규칙 남기기 */
touch('plan', 5, l => {
  beforeLast(l, {title: '다음에도 지킬 규칙을 AGENTS.md로 남겨요', text: 'AGENTS.md는 Codex가 작업을 시작하기 전에 읽는 규칙 파일이에요. 실습 폴더 맨 위에 두면 매번 같은 부탁을 반복하지 않아도 됩니다. 아래 요청으로 Codex에게 만들어 달라고 한 뒤, 파일을 열어 내용을 직접 읽어 보세요. 새 대화에서 “이 폴더의 규칙을 요약해 줘”라고 물어 규칙을 알고 있는지 확인합니다. 규칙 파일이 있어도 권한 승인 창은 그대로 읽고 판단해요.', prompt: '이 실습 폴더 맨 위에 AGENTS.md 파일을 만들어 줘. 내용은 네 가지야. 설명은 쉬운 한국어로 하기, 파일 삭제나 프로그램 설치 전에는 반드시 먼저 물어보기, 보관 폴더의 원본은 수정하지 않기, 학생 개인정보는 넣지 않기. 다른 파일은 고치지 마.', links: [{label: '공식 AGENTS.md 안내', url: 'https://learn.chatgpt.com/docs/agent-configuration/agents-md'}]});
  l.checks.push('실습 폴더에 AGENTS.md가 생겼고, 새 대화에서 Codex가 네 가지 규칙을 말했어요.');
  addSource(l, src.agents);
});

/* Codex 6편 · 앱 안 브라우저에서 고칠 곳 표시 */
touch('modify', 5, l => {
  l.steps.push({title: '앱 안 브라우저에서 고칠 곳을 직접 표시해요(계정에 따라)', text: 'ChatGPT 데스크톱 앱에는 내장 브라우저가 있어요. 입력창에 @Browser를 넣어 보드를 열어 달라고 하세요. 화면이 열리면 브라우저 도구 막대의 Annotate를 눌러 Annotation mode로 들어가고, 고칠 부분을 클릭하거나 끌어서 고른 뒤 코멘트를 적어 저장합니다. 그다음 채팅에서 “코멘트를 반영해 줘”라고 보내면 됩니다. 계정이나 앱 버전에 따라 내장 브라우저가 없을 수 있어요. 그럴 때는 지금까지처럼 더블클릭으로 열고 본 것을 글로 전달합니다. 반영 뒤에는 더블클릭으로 다시 열어 기존 기능이 그대로인지 확인하세요.', prompt: '@Browser 실습 폴더의 2026-09-20-classroom-board.html을 열어 줘. 아직 파일은 고치지 말고, 화면에 보이는 제목과 버튼 이름만 알려 줘.', links: [{label: '공식 내장 브라우저 안내', url: 'https://learn.chatgpt.com/docs/browser'}]});
  l.checks.push('(내장 브라우저가 있다면) 코멘트를 단 부분만 바뀌고 저장·진행 화면은 그대로였어요.');
  addSource(l, src.browser);
});

/* Codex 3편 · 사실과 다른 문장 바로잡기 */
touch('run', 0, l => {
  const st = l.steps[4];
  if (st) st.text = st.text.replace('Codex는 파일을 읽을 수 있지만 브라우저 화면을 직접 볼 수는 없어요. 그래서 내가 본 것을 아래 요청의 대괄호에 적어 전달합니다.', '더블클릭으로 연 브라우저 화면은 Codex가 볼 수 없어요. 그래서 내가 본 것을 아래 요청의 대괄호에 적어 전달합니다. 계정에 따라 앱 안 내장 브라우저로 화면을 함께 볼 수도 있는데, 그 방법은 6편에서 다뤄요.');
});

/* 채팅 5편 · 창 하나만 보내기(Appshots) */
touch('images', 0, l => {
  l.troubleshooting.push({question: 'Windows에서 창 하나만 빠르게 보내고 싶어요.', answer: 'ChatGPT 데스크톱 앱의 Appshots를 쓰면 맨 앞에 있는 창 하나를 그림과 글자로 함께 첨부할 수 있어요. 보낼 창을 맨 앞에 두고 양쪽 Alt 키를 함께 누릅니다. 권한 안내가 나오면 따르세요. 화면에 보이지 않는 스크롤 아래 글자까지 함께 전달될 수 있으니, 개인정보가 있는 창에서는 쓰지 않습니다.'});
  addSource(l, src.appshots);
});
})();
