/* ═══════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════ */
const S = {
  page: 'home',
  voice: 'mann',
  mode: {},       // per-module mode: 'lytte' or 'ove'
  audio: null,    // current Howl
  noiseAudio: new Howl({ src: ['audio/people-talking.mp3'], loop: true, volume: 0.3 }),
  noisePlaying: false,
  noiseVolume: 0.3,
};

/* ═══════════════════════════════════════════
   THEME
   ═══════════════════════════════════════════ */
function initTheme() {
  const saved = localStorage.getItem('ci-theme');
  const theme = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(theme);
}

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('ci-theme', t);
  const icon = document.querySelector('.theme-icon');
  icon.textContent = t === 'dark' ? 'light_mode' : 'dark_mode';
  const tog = document.getElementById('theme-toggle');
  tog.classList.toggle('on', t === 'dark');
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  applyTheme(cur === 'dark' ? 'light' : 'dark');
}

/* ═══════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════ */
function navigateTo(page) {
  stopAudio();
  S.page = page;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) { el.classList.remove('active'); void el.offsetWidth; el.classList.add('active'); }

  // Update nav
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.page === page));
  document.querySelectorAll('.desktop-nav .nav-link').forEach(n => n.classList.toggle('active', n.dataset.page === page));

  // Init module
  if (page === 'tall') initTall();
  if (page === 'dato') initDato();
  if (page === 'ord') initOrd();
  if (page === 'setning') initSetning();
  if (page === 'ordpar') initOrdpar();
  if (page === 'oppbygging') initOppbygging();
  if (page === 'miljolyder') initMiljo();
  if (page === 'tekster') initTekster();

  window.scrollTo(0, 0);
}

/* ═══════════════════════════════════════════
   AUDIO HELPERS
   ═══════════════════════════════════════════ */
function stopAudio() {
  if (S.audio) { S.audio.stop(); S.audio.unload(); S.audio = null; }
  document.querySelectorAll('.speaker-indicator').forEach(s => s.classList.remove('show'));
}

function playAudio(src, moduleId, onEnd) {
  stopAudio();
  const speaker = document.getElementById('speaker-global');
  if (speaker) speaker.classList.add('show');

  S.audio = new Howl({
    src: [src],
    onend: () => { document.querySelectorAll('.selected').forEach(c => c.classList.remove('selected'));
      if (speaker) speaker.classList.remove('show');
      if (onEnd) onEnd();
    },
    onloaderror: () => { if (speaker) speaker.classList.remove('show'); },
  });
  S.audio.play();
}

function setVoice(v, btn) {
  S.voice = v;
  const bar = btn.closest('.settings-bar');
  bar.querySelectorAll('.pill-toggle[data-voice]').forEach(b => b.classList.toggle('active', b.dataset.voice === v));
}
function setVoiceGlobal(v, btn) {
  S.voice = v;
  btn.parentElement.querySelectorAll('.pill-toggle').forEach(b => b.classList.toggle('active', b.dataset.voice === v));
  document.querySelectorAll('.settings-bar .pill-toggle[data-voice]').forEach(b => b.classList.toggle('active', b.dataset.voice === v));
}

function toggleNoise(btn) {
  btn.classList.toggle('active');
  const moduleId = S.page;
  const panel = document.getElementById('noise-panel-' + moduleId);
  if (btn.classList.contains('active')) {
    if (panel) panel.classList.add('show');
    S.noisePlaying = true;
    S.noiseAudio.play();
  } else {
    if (panel) panel.classList.remove('show');
    S.noisePlaying = false;
    S.noiseAudio.stop();
  }
}

function setNoiseVolume(val, moduleId) {
  S.noiseVolume = val / 100;
  S.noiseAudio.volume(S.noiseVolume);
  const span = document.getElementById('noise-val-' + moduleId);
  if (span) span.textContent = val + '%';
}

function setMode(moduleId, mode, btn) {
  S.mode[moduleId] = mode;
  const selector = btn.closest('.mode-selector');
  selector.querySelectorAll('.mode-option').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const controls = document.getElementById('exercise-controls-' + moduleId);
  if (mode === 'ove') {
    if (controls) controls.style.display = 'flex';
    resetExercise(moduleId);
  } else {
    if (controls) controls.style.display = 'none';
    clearProgress(moduleId);
    clearResult(moduleId);
    const grid = document.getElementById(moduleId + '-grid') || document.getElementById('number-grid');
    if (grid) grid.querySelectorAll('[class*="-cell"]').forEach(c => {
      c.classList.remove('dimmed','correct-cell','wrong-cell','highlighted');
    });
  }
  // Dato: clear both grids
  if (moduleId === 'dato') {
    document.querySelectorAll('#dato-dag-grid .dato-cell, #dato-mnd-grid .dato-month-cell, #dato-ord-grid .dato-month-cell').forEach(c => {
      c.classList.remove('selected','dimmed','correct-cell','wrong-cell','highlighted');
    });
  }
  // Miljolyder: toggle between full list and quiz
  if (moduleId === 'miljolyder') {
    document.getElementById('miljolyder-content').style.display = mode === 'lytte' ? '' : 'none';
    document.getElementById('miljolyder-quiz').style.display = mode === 'ove' ? 'grid' : 'none';
    if (mode === 'ove') document.getElementById('miljolyder-quiz').innerHTML = '';
  }
}

/* ═══════════════════════════════════════════
   EXERCISE ENGINE
   ═══════════════════════════════════════════ */
const exercises = {};

function initExercise(moduleId, items, total) {
  exercises[moduleId] = {
    items: items,
    total: Math.min(total || 20, items.length),
    current: -1,
    correct: 0,
    answered: 0,
    currentAnswer: null,
    history: [],
  };
  renderProgress(moduleId);
}

function renderProgress(moduleId) {
  const ex = exercises[moduleId];
  if (!ex) return;
  const container = document.getElementById('progress-' + moduleId);
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < ex.total; i++) {
    const dot = document.createElement('div');
    dot.className = 'progress-dot';
    if (i < ex.history.length) dot.classList.add(ex.history[i] ? 'correct' : 'wrong');
    else if (i === ex.history.length && ex.current >= 0) dot.classList.add('current');
    container.appendChild(dot);
  }
}

function clearProgress(moduleId) {
  const c = document.getElementById('progress-' + moduleId);
  if (c) c.innerHTML = '';
}

function showResult(moduleId) {
  const ex = exercises[moduleId];
  const el = document.getElementById('result-' + moduleId);
  if (!el || !ex) return;
  el.className = 'result-banner show ' + (ex.correct >= ex.total / 2 ? 'correct-banner' : 'wrong-banner');
  el.innerHTML = `<div class="result-score">${ex.correct} / ${ex.total}</div><div class="result-label">Riktige svar</div>`;
}
function clearResult(moduleId) {
  const el = document.getElementById('result-' + moduleId);
  if (el) { el.className = 'result-banner'; el.innerHTML = ''; }
}

function resetExercise(moduleId) {
  clearResult(moduleId);
  const startBtn = document.getElementById('start-btn-' + moduleId);
  const repeatBtn = document.getElementById('repeat-btn-' + moduleId);
  const fasitBtn = document.getElementById('fasit-btn-' + moduleId);
  if (startBtn) { startBtn.innerHTML = '<span class="material-icons-round">play_arrow</span>Start'; startBtn.disabled = false; startBtn.classList.add('pulsing'); }
  if (repeatBtn) repeatBtn.disabled = true;
  if (fasitBtn) fasitBtn.disabled = true;
  if (exercises[moduleId]) { exercises[moduleId].current = -1; exercises[moduleId].correct = 0; exercises[moduleId].answered = 0; exercises[moduleId].history = []; exercises[moduleId].currentAnswer = null; }
  clearProgress(moduleId);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function highlightCell(gridId, idx) {
  const grid = document.getElementById(gridId);
  grid.querySelectorAll('.selected').forEach(c => c.classList.remove('selected'));
  const cells = grid.querySelectorAll('[class*="-cell"]');
  if (cells[idx]) cells[idx].classList.add('selected');
}

function highlightWordCell(gridId, idx) {
  const grid = document.getElementById(gridId);
  grid.querySelectorAll('.word-cell').forEach(c => c.classList.remove('selected'));
  grid.children[idx]?.classList.add('selected');
}
