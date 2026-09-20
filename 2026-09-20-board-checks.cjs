/* Mock regression checks: loads the real HTML script in node:vm.
   DOM, storage, file picker, downloads, timers and confirm are mocked.
   This is not evidence of real browser rendering or file upload behavior. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '2026-09-20-classroom-board.html'), 'utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const KEY = 'gssam-classroom-board-v1';
const validBackup = JSON.parse(fs.readFileSync(path.join(__dirname, '2026-09-20-보드-연습백업.json'), 'utf8'));
const invalidBackup = fs.readFileSync(path.join(__dirname, '2026-09-20-보드-오류검증.json'), 'utf8');

function setup(options = {}) {
  const nodes = new Map(), created = [], blobs = [], revoked = [], confirmations = [], writes = [];
  const data = new Map();
  if (options.stored !== undefined) data.set(KEY, options.stored);
  class Element {
    constructor(tag) { this.tagName = tag; this.children = []; this.style = {}; this.events = {}; this.attributes = {}; this.textContent = ''; this.value = ''; this.hidden = false; }
    append(...items) { this.children.push(...items); }
    replaceChildren(...items) { this.children = items; }
    addEventListener(name, callback) { this.events[name] = callback; }
    setAttribute(name, value) { this.attributes[name] = value; }
    removeAttribute(name) { delete this.attributes[name]; delete this[name]; }
    querySelector(tag) { for (const c of this.children) { if (c.tagName === tag) return c; const found = c.querySelector?.(tag); if (found) return found; } return null; }
    click() { this.clicked = true; if (this.onclick) this.onclick(); }
  }
  class BrowserURL extends URL {}
  BrowserURL.createObjectURL = blob => { blobs.push(blob); return 'blob:mock-' + blobs.length; };
  BrowserURL.revokeObjectURL = url => revoked.push(url);
  let now = 100000, interval, intervalActive = false;
  class FakeDate extends Date { constructor(...args) { super(...(args.length ? args : [now])); } static now() { return now; } }
  const context = vm.createContext({
    console, structuredClone, Blob, URL: BrowserURL, Date: FakeDate,
    document: {
      getElementById(id) { if (!nodes.has(id)) nodes.set(id, new Element('div')); return nodes.get(id); },
      createElement(tag) { const element = new Element(tag); created.push(element); return element; },
    },
    localStorage: {
      getItem(key) { if (options.readFails) throw Error('mock read failure'); return data.get(key) ?? null; },
      setItem(key, value) { writes.push({ key, value }); if (options.writeFails) throw Error('mock quota failure'); data.set(key, value); },
    },
    confirm(message) { confirmations.push(message); return options.confirm !== false; },
    setInterval(callback) { interval = callback; intervalActive = true; return 1; },
    clearInterval() { intervalActive = false; },
    setTimeout(callback) { callback(); return 1; },
    window: { scrollTo() {} },
  });
  vm.runInContext(source, context, { filename: 'classroom-board-inline.js' });
  const inspect = expression => vm.runInContext(expression, context);
  const snapshot = () => JSON.parse(inspect('JSON.stringify(state)'));
  const upload = async (text, size = Buffer.byteLength(text)) => {
    const event = { target: { value: 'mock-file.json', files: [{ size, text: async () => text }] } };
    await nodes.get('file').onchange(event);
    assert.equal(event.target.value, '', 'file picker is reset, allowing re-selection');
  };
  return { nodes, created, blobs, revoked, data, confirmations, writes, inspect, snapshot, upload,
    advance(ms) { now += ms; if (intervalActive) interval(); },
  };
}

let passed = 0;
async function check(name, action) { await action(); passed++; console.log('PASS ' + name); }
(async () => {
  await check('real script starts with grade 3 magnet lesson and 5/25/10-minute activities', () => {
    const env = setup(); const lesson = env.snapshot().lessons[0];
    assert.match(lesson.title, /3학년.*자석/);
    assert.deepEqual(lesson.activities.map(a => a.minutes), [5, 25, 10]);
    assert.equal(env.writes.length, 0, 'startup must not overwrite storage');
  });
  await check('malformed JSON is rejected without mutation or write', async () => {
    const env = setup(), before = env.snapshot(); await env.upload('{bad');
    assert.deepEqual(env.snapshot(), before); assert.equal(env.writes.length, 0);
    assert.match(env.nodes.get('notice').textContent, /불러오지 못했습니다/);
  });
  await check('file over 1 MB is rejected before reading or confirmation', async () => {
    const env = setup(), before = env.snapshot(); let read = false;
    await env.nodes.get('file').onchange({ target: { files: [{ size: 1024 * 1024 + 1, text() { read = true; throw Error('must not read'); } }] } });
    assert.equal(read, false); assert.deepEqual(env.snapshot(), before);
    assert.equal(env.confirmations.length, 0); assert.equal(env.writes.length, 0);
    assert.match(env.nodes.get('notice').textContent, /1MB/);
  });
  await check('dangerous URL fixture is rejected without mutation', async () => {
    const env = setup(), before = env.snapshot(); await env.upload(invalidBackup);
    assert.deepEqual(env.snapshot(), before); assert.equal(env.writes.length, 0);
    assert.equal(env.confirmations.length, 0); assert.match(env.nodes.get('notice').textContent, /자료 링크/);
  });
  await check('validation rejects unsafe URL schemes, invalid duration and unsupported schema', () => {
    const env = setup();
    for (const url of ['javascript:alert(1)', 'data:text/html,test', 'file:///C:/secret', '/relative']) {
      const input = structuredClone(validBackup); input.lessons[0].activities[0].url = url;
      assert.throws(() => env.inspect('validate(' + JSON.stringify(input) + ')'));
    }
    for (const minutes of [0, 181, 1.5, '5']) {
      const input = structuredClone(validBackup); input.lessons[0].activities[0].minutes = minutes;
      assert.throws(() => env.inspect('validate(' + JSON.stringify(input) + ')'));
    }
    for (const input of [null, { version: 2, lessons: validBackup.lessons }, { version: 1, lessons: [] }])
      assert.throws(() => env.inspect('validate(' + JSON.stringify(input) + ')'));
  });
  await check('cancelled restoration leaves original state and persisted bytes unchanged', async () => {
    const original = JSON.stringify(validBackup); const env = setup({ stored: original, confirm: false });
    const input = structuredClone(validBackup); input.lessons[0].title = '교체되어서는 안 됨';
    await env.upload(JSON.stringify(input));
    assert.deepEqual(env.snapshot(), validBackup); assert.equal(env.data.get(KEY), original);
    assert.equal(env.writes.length, 0); assert.equal(env.confirmations.length, 1);
  });
  await check('confirmed valid backup restores, persists and can be reloaded', async () => {
    const env = setup(); await env.upload(JSON.stringify(validBackup));
    assert.deepEqual(env.snapshot(), validBackup); assert.equal(env.writes.length, 1);
    assert.deepEqual(JSON.parse(env.data.get(KEY)), validBackup);
    assert.deepEqual(setup({ stored: env.data.get(KEY) }).snapshot(), validBackup);
  });
  await check('corrupt stored data stays untouched and automatic writes are blocked', () => {
    const raw = '{damaged-original'; const env = setup({ stored: raw });
    assert.equal(env.inspect('storageBlocked'), true); env.nodes.get('newLesson').onclick();
    assert.equal(env.data.get(KEY), raw); assert.equal(env.writes.length, 0);
    assert.match(env.nodes.get('notice').textContent, /원본을 보호/);
    assert.match(env.nodes.get('saved').textContent, /자동 저장 중지/);
  });
  await check('storage read exception blocks saving; explicit valid restore recovers', async () => {
    const raw = JSON.stringify(validBackup); const env = setup({ stored: raw, readFails: true });
    env.inspect('save()'); assert.equal(env.writes.length, 0); assert.equal(env.data.get(KEY), raw);
    await env.upload(raw); assert.equal(env.inspect('storageBlocked'), false);
    assert.equal(env.writes.length, 1); assert.deepEqual(env.snapshot(), validBackup);
  });
  await check('storage quota failure preserves old bytes and keeps current work in memory', () => {
    const raw = JSON.stringify(validBackup); const env = setup({ stored: raw, writeFails: true });
    env.nodes.get('newLesson').onclick();
    assert.equal(env.snapshot().lessons.length, validBackup.lessons.length + 1);
    assert.equal(env.data.get(KEY), raw); assert.match(env.nodes.get('saved').textContent, /저장 실패/);
    assert.match(env.nodes.get('notice').textContent, /バックアップ|백업 다운로드/);
  });
  await check('download serializes actual in-memory edits into valid importable JSON', async () => {
    const env = setup(); env.nodes.get('newLesson').onclick(); env.nodes.get('backup').onclick();
    assert.equal(env.blobs.length, 1); const raw = await env.blobs[0].text();
    assert.deepEqual(JSON.parse(raw), env.snapshot());
    const anchor = env.created.find(element => element.download);
    assert.match(anchor.download, /^\d{4}-\d{2}-\d{2}-수업운영보드-백업\.json$/);
    assert.equal(anchor.clicked, true); assert.deepEqual(env.revoked, ['blob:mock-1']);
    const restored = setup(); await restored.upload(raw); assert.deepEqual(restored.snapshot(), env.snapshot());
  });
  await check('delayed timer interval catches up; pause stops elapsed changes', () => {
    const env = setup(); env.inspect('start()'); env.nodes.get('toggleTimer').onclick(); env.advance(75000);
    assert.equal(env.nodes.get('timer').textContent, '03:45');
    env.nodes.get('toggleTimer').onclick(); env.advance(10000);
    assert.equal(env.nodes.get('timer').textContent, '03:45');
  });
  console.log('\n' + passed + ' mock regression checks passed. Real browser rendering/uploads are not covered.');
})().catch(error => { console.error(error); process.exitCode = 1; });
