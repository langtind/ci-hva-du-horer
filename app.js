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

  window.scrollTo(0, 0);
}

/* ═══════════════════════════════════════════
   SETTINGS
   ═══════════════════════════════════════════ */


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
  // Miljølyder: toggle between full list and quiz
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

/* ═══════════════════════════════════════════
   MODULE: TALL (Numbers)
   ═══════════════════════════════════════════ */
function initTall() {
  const grid = document.getElementById('number-grid');
  if (grid.children.length > 0) return;
  S.mode.tall = 'lytte';
  for (let i = 0; i < 100; i++) {
    const cell = document.createElement('div');
    cell.className = 'num-cell';
    cell.textContent = i;
    cell.dataset.num = i;
    cell.addEventListener('click', () => tallCellClick(i));
    grid.appendChild(cell);
  }
}

function tallCellClick(num) {
  const mode = S.mode.tall || 'lytte';
  if (mode === 'lytte') {
    playAudio(`audio/tall/${S.voice}/${num}.mp3`, 'tall');
    highlightCell('number-grid', num);
  } else {
    tallGuess(num);
  }
}

function highlightCell(gridId, idx) {
  const grid = document.getElementById(gridId);
  grid.querySelectorAll('.selected').forEach(c => c.classList.remove('selected'));
  const cells = grid.querySelectorAll('[class*="-cell"]');
  if (cells[idx]) cells[idx].classList.add('selected');
}

function tallStart() {
  const ex = exercises.tall;
  if (!ex || ex.current === -1) {
    const indices = shuffle(Array.from({length: 100}, (_, i) => i));
    initExercise('tall', indices, 20);
  }
  tallNext();
}

function tallNext() {
  const ex = exercises.tall;
  if (ex.answered >= ex.total) { showResult('tall'); resetExercise('tall'); return; }

  // Clear previous highlights
  document.querySelectorAll('#number-grid .num-cell').forEach(c => c.classList.remove('selected','correct-cell','wrong-cell','highlighted'));

  ex.current = ex.items[ex.answered];
  ex.currentAnswer = ex.current;
  renderProgress('tall');

  const btn = document.getElementById('start-btn-tall');
  btn.innerHTML = '<span class="material-icons-round">skip_next</span>Neste';
  btn.classList.remove('pulsing');
  document.getElementById('repeat-btn-tall').disabled = false;
  document.getElementById('fasit-btn-tall').disabled = false;

  playAudio(`audio/tall/${S.voice}/${ex.current}.mp3`, 'tall');
}

function tallRepeat() {
  const ex = exercises.tall;
  if (ex && ex.currentAnswer !== null) playAudio(`audio/tall/${S.voice}/${ex.currentAnswer}.mp3`, 'tall');
}

function tallFasit() {
  const ex = exercises.tall;
  if (!ex || ex.currentAnswer === null) return;
  const cells = document.querySelectorAll('#number-grid .num-cell');
  cells[ex.currentAnswer].classList.add('highlighted');
}

function tallGuess(num) {
  const ex = exercises.tall;
  if (!ex || ex.currentAnswer === null) return;
  const cells = document.querySelectorAll('#number-grid .num-cell');
  const isCorrect = num === ex.currentAnswer;
  cells[num].classList.add(isCorrect ? 'correct-cell' : 'wrong-cell');
  if (!isCorrect) cells[ex.currentAnswer].classList.add('highlighted');
  if (isCorrect) ex.correct++;
  ex.history.push(isCorrect);
  ex.answered++;
  ex.currentAnswer = null;
  renderProgress('tall');

  setTimeout(() => tallNext(), 1200);
}

/* ═══════════════════════════════════════════
   MODULE: DATO (Dates)
   ═══════════════════════════════════════════ */
const MONTHS = ['januar','februar','mars','april','mai','juni','juli','august','september','oktober','november','desember'];
const ORD_MONTHS = ['i første','i andre','i tredje','i fjerde','i femte','i sjette','i sjuende','i åttende','i niende','i tiende','i ellevte','i tolvte'];

function initDato() {
  const dagGrid = document.getElementById('dato-dag-grid');
  const mndGrid = document.getElementById('dato-mnd-grid');
  const ordGrid = document.getElementById('dato-ord-grid');
  if (dagGrid.children.length > 0) return;
  S.mode.dato = 'lytte';

  for (let i = 1; i <= 31; i++) {
    const cell = document.createElement('div');
    cell.className = 'dato-cell';
    cell.textContent = i + '.';
    cell.dataset.dag = i;
    cell.addEventListener('click', () => datoDagClick(i));
    dagGrid.appendChild(cell);
  }

  MONTHS.forEach((m, idx) => {
    const cell = document.createElement('div');
    cell.className = 'dato-month-cell';
    cell.textContent = m.charAt(0).toUpperCase() + m.slice(1);
    cell.dataset.mnd = idx;
    cell.addEventListener('click', () => datoMndClick(idx));
    mndGrid.appendChild(cell);
  });

  ORD_MONTHS.forEach((label, idx) => {
    const cell = document.createElement('div');
    cell.className = 'dato-month-cell';
    cell.textContent = label;
    cell.dataset.ord = idx;
    cell.addEventListener('click', () => datoOrdClick(idx));
    ordGrid.appendChild(cell);
  });
}

function datoDagClick(dag) {
  if ((S.mode.dato || 'lytte') === 'lytte') {
    playAudio(`audio/ordenstall/${S.voice}/${dag}.mp3`, 'dato');
    document.querySelectorAll('#dato-dag-grid .dato-cell.selected').forEach(c => c.classList.remove('selected'));
    const cells = document.querySelectorAll('#dato-dag-grid .dato-cell');
    cells[dag - 1].classList.add('selected');
  } else {
    datoGuess('dag', dag);
  }
}

function datoMndClick(idx) {
  if ((S.mode.dato || 'lytte') === 'lytte') {
    playAudio(`audio/dato/${S.voice}/${MONTHS[idx]}.mp3`, 'dato');
    document.querySelectorAll('#dato-mnd-grid .dato-month-cell.selected').forEach(c => c.classList.remove('selected'));
    const cells = document.querySelectorAll('#dato-mnd-grid .dato-month-cell');
    cells[idx].classList.add('selected');
  } else {
    datoGuess('mnd', idx);
  }
}

function datoOrdClick(idx) {
  if ((S.mode.dato || 'lytte') === 'lytte') {
    playAudio(`audio/dato/${S.voice}/i${idx + 1}.mp3`, 'dato');
    document.querySelectorAll('#dato-ord-grid .dato-month-cell.selected').forEach(c => c.classList.remove('selected'));
    const cells = document.querySelectorAll('#dato-ord-grid .dato-month-cell');
    cells[idx].classList.add('selected');
  }
}

let datoSelection = { dag: null, mnd: null };

function datoStart() {
  const ex = exercises.dato;
  if (!ex || ex.current === -1) {
    // Generate random date+month combos
    const combos = [];
    for (let d = 1; d <= 31; d++) {
      for (let m = 0; m < 12; m++) {
        // Skip invalid dates (31st of months with 30 or fewer days, etc.)
        if (d > 28 && m === 1) continue; // feb
        if (d > 30 && [3,5,8,10].includes(m)) continue; // 30-day months
        combos.push({ dag: d, mnd: m });
      }
    }
    const items = shuffle(combos);
    initExercise('dato', items, 20);
  }
  datoNext();
}

function datoNext() {
  const ex = exercises.dato;
  if (ex.answered >= ex.total) { showResult('dato'); resetExercise('dato'); return; }

  document.querySelectorAll('#dato-dag-grid .dato-cell, #dato-mnd-grid .dato-month-cell, #dato-ord-grid .dato-month-cell').forEach(c =>
    c.classList.remove('selected','correct-cell','wrong-cell','highlighted'));

  const combo = ex.items[ex.answered];
  ex.current = combo;
  ex.currentAnswer = combo;
  datoSelection = { dag: null, mnd: null };
  renderProgress('dato');

  const btn = document.getElementById('start-btn-dato');
  btn.innerHTML = '<span class="material-icons-round">skip_next</span>Neste';
  btn.classList.remove('pulsing');
  document.getElementById('repeat-btn-dato').disabled = false;
  document.getElementById('fasit-btn-dato').disabled = false;

  // Play ordinal number then month
  playAudio(`audio/ordenstall/${S.voice}/${combo.dag}.mp3`, 'dato', () => {
    setTimeout(() => {
      playAudio(`audio/dato/${S.voice}/${MONTHS[combo.mnd]}.mp3`, 'dato');
    }, 300);
  });
}

function datoRepeat() {
  const ex = exercises.dato;
  if (!ex || !ex.currentAnswer) return;
  const combo = ex.currentAnswer;
  playAudio(`audio/ordenstall/${S.voice}/${combo.dag}.mp3`, 'dato', () => {
    setTimeout(() => {
      playAudio(`audio/dato/${S.voice}/${MONTHS[combo.mnd]}.mp3`, 'dato');
    }, 300);
  });
}

function datoFasit() {
  const ex = exercises.dato;
  if (!ex || !ex.currentAnswer) return;
  const dagCells = document.querySelectorAll('#dato-dag-grid .dato-cell');
  const mndCells = document.querySelectorAll('#dato-mnd-grid .dato-month-cell');
  dagCells[ex.currentAnswer.dag - 1].classList.add('highlighted');
  mndCells[ex.currentAnswer.mnd].classList.add('highlighted');
}

function datoGuess(type, val) {
  const ex = exercises.dato;
  if (!ex || !ex.currentAnswer) return;

  if (type === 'dag') {
    datoSelection.dag = val;
    document.querySelectorAll('#dato-dag-grid .dato-cell').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('#dato-dag-grid .dato-cell')[val - 1].classList.add('selected');
  } else {
    datoSelection.mnd = val;
    document.querySelectorAll('#dato-mnd-grid .dato-month-cell').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('#dato-mnd-grid .dato-month-cell')[val].classList.add('selected');
  }

  // Both selected? Evaluate
  if (datoSelection.dag !== null && datoSelection.mnd !== null) {
    const dagCorrect = datoSelection.dag === ex.currentAnswer.dag;
    const mndCorrect = datoSelection.mnd === ex.currentAnswer.mnd;
    const isCorrect = dagCorrect && mndCorrect;

    const dagCells = document.querySelectorAll('#dato-dag-grid .dato-cell');
    const mndCells = document.querySelectorAll('#dato-mnd-grid .dato-month-cell');

    dagCells[datoSelection.dag - 1].classList.remove('selected');
    dagCells[datoSelection.dag - 1].classList.add(dagCorrect ? 'correct-cell' : 'wrong-cell');
    mndCells[datoSelection.mnd].classList.remove('selected');
    mndCells[datoSelection.mnd].classList.add(mndCorrect ? 'correct-cell' : 'wrong-cell');

    if (!dagCorrect) dagCells[ex.currentAnswer.dag - 1].classList.add('highlighted');
    if (!mndCorrect) mndCells[ex.currentAnswer.mnd].classList.add('highlighted');

    if (isCorrect) ex.correct++;
    ex.history.push(isCorrect);
    ex.answered++;
    ex.currentAnswer = null;
    renderProgress('dato');

    setTimeout(() => datoNext(), 1200);
  }
}

/* ═══════════════════════════════════════════
   MODULE: ORD (Words)
   ═══════════════════════════════════════════ */
const ORD_DATA = {
  M: { display: ["mat","musikk","medisin","melk","mamma","marsipan","mygg","møte","matpakke","mel","middag","maleri"], audio: ["mat","musikk","medisin","melk","mamma","marsipan","mygg","mote","matpakke","mel","middag","maleri"] },
  K: { display: ["katt","kake","kakao","knapp","kaffe","kalender","kald","klokke","kamera","kopp","komfyr","kamerat"], audio: ["katt","kake","kakao","knapp","kaffe","kalender","kald","klokke","kamera","kopp","komfyr","kamerat"] },
  T: { display: ["tog","TV","telefon","takk","trafikk","tannbørste","tre","trimme","terrasse","tur","tannkrem","teater"], audio: ["tog","tv","telefon","takk","trafikk","tannborste","tre","trimme","terrasse","tur","tannkrem","teater"] },
  S: { display: ["sol","smile","syltetøy","sko","skole","sitteplass","sur","spise","spagetti","snø","sulten","sydentur"], audio: ["sol","smile","syltetoy","sko","skole","sitteplass","sur","spise","spagetti","sno","sulten","sydentur"] },
  L: { display: ["lys","lærer","leppestift","lat","lue","lørdagskveld","laks","lampe","lyspære","lønn","limstift","lammelår"], audio: ["lys","laerer","leppestift","lat","lue","lordagskveld","laks","lampe","lyspaere","lonn","limstift","lammelar"] },
  Mix: { display: ["jobb","butikk","brødskive","buss","avis","fotballkamp","bil","PC","fjernkontroll","sport","gave","bakgrunnstøy"], audio: ["jobb","butikk","brodskive","buss","avis","fotballkamp","bil","pc","fjernkontroll","sport","gave","bakgrunnsstoy"] },
};

let ordCurrentGroup = 'M';

function initOrd() {
  S.mode.ord = 'lytte';
  renderOrdTabs('ord-tabs', Object.keys(ORD_DATA), ordCurrentGroup, (g) => { ordCurrentGroup = g; renderOrdGrid(); });
  renderOrdGrid();
}

function renderOrdTabs(containerId, groups, active, onClick) {
  const c = document.getElementById(containerId);
  c.innerHTML = '';
  groups.forEach(g => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (g === active ? ' active' : '');
    btn.textContent = g;
    btn.addEventListener('click', () => {
      c.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      onClick(g);
    });
    c.appendChild(btn);
  });
}

function renderOrdGrid() {
  const grid = document.getElementById('ord-grid');
  const data = ORD_DATA[ordCurrentGroup];
  grid.innerHTML = '';
  data.display.forEach((word, i) => {
    const cell = document.createElement('div');
    cell.className = 'word-cell';
    cell.textContent = word;
    cell.addEventListener('click', () => ordCellClick(i));
    grid.appendChild(cell);
  });
  resetExercise('ord');
}

function ordCellClick(idx) {
  const data = ORD_DATA[ordCurrentGroup];
  if ((S.mode.ord || 'lytte') === 'lytte') {
    playAudio(`audio/ord/${S.voice}/${data.audio[idx]}.mp3`, 'ord');
    highlightWordCell('ord-grid', idx);
  } else {
    ordGuess(idx);
  }
}

function highlightWordCell(gridId, idx) {
  const grid = document.getElementById(gridId);
  grid.querySelectorAll('.word-cell').forEach(c => c.classList.remove('selected'));
  grid.children[idx]?.classList.add('selected');
}

function ordStart() {
  const data = ORD_DATA[ordCurrentGroup];
  const ex = exercises.ord;
  if (!ex || ex.current === -1) {
    initExercise('ord', shuffle(Array.from({length: data.display.length}, (_, i) => i)), Math.min(12, data.display.length));
  }
  ordNext();
}

function ordNext() {
  const ex = exercises.ord;
  if (ex.answered >= ex.total) { showResult('ord'); resetExercise('ord'); return; }
  document.querySelectorAll('#ord-grid .word-cell').forEach(c => c.classList.remove('selected','correct-cell','wrong-cell','highlighted'));
  ex.current = ex.items[ex.answered];
  ex.currentAnswer = ex.current;
  renderProgress('ord');
  const btn = document.getElementById('start-btn-ord');
  btn.innerHTML = '<span class="material-icons-round">skip_next</span>Neste';
  btn.classList.remove('pulsing');
  document.getElementById('repeat-btn-ord').disabled = false;
  document.getElementById('fasit-btn-ord').disabled = false;
  const data = ORD_DATA[ordCurrentGroup];
  playAudio(`audio/ord/${S.voice}/${data.audio[ex.current]}.mp3`, 'ord');
}

function ordRepeat() {
  const ex = exercises.ord;
  if (ex?.currentAnswer !== null) {
    const data = ORD_DATA[ordCurrentGroup];
    playAudio(`audio/ord/${S.voice}/${data.audio[ex.currentAnswer]}.mp3`, 'ord');
  }
}

function ordFasit() {
  const ex = exercises.ord;
  if (!ex || ex.currentAnswer === null) return;
  document.querySelectorAll('#ord-grid .word-cell')[ex.currentAnswer]?.classList.add('highlighted');
}

function ordGuess(idx) {
  const ex = exercises.ord;
  if (!ex || ex.currentAnswer === null) return;
  const cells = document.querySelectorAll('#ord-grid .word-cell');
  const isCorrect = idx === ex.currentAnswer;
  cells[idx]?.classList.add(isCorrect ? 'correct-cell' : 'wrong-cell');
  if (!isCorrect) cells[ex.currentAnswer]?.classList.add('highlighted');
  if (isCorrect) ex.correct++;
  ex.history.push(isCorrect);
  ex.answered++;
  ex.currentAnswer = null;
  renderProgress('ord');
  setTimeout(() => ordNext(), 1200);
}

/* ═══════════════════════════════════════════
   MODULE: SETNING (Sentences)
   ═══════════════════════════════════════════ */
let setningCurrentGroup = 'M';
let setningNum = 1; // 1, 2, or 3

function initSetning() {
  S.mode.setning = 'lytte';
  renderOrdTabs('setning-tabs', Object.keys(ORD_DATA), setningCurrentGroup, (g) => { setningCurrentGroup = g; renderSetningGrid(); });
  renderSetningGrid();
}

function renderSetningGrid() {
  const grid = document.getElementById('setning-grid');
  const data = ORD_DATA[setningCurrentGroup];
  grid.innerHTML = '';
  data.display.forEach((word, i) => {
    const cell = document.createElement('div');
    cell.className = 'word-cell';
    cell.textContent = word;
    cell.addEventListener('click', () => setningCellClick(i));
    grid.appendChild(cell);
  });
  setningNum = Math.ceil(Math.random() * 3);
  resetExercise('setning');
}

function setningCellClick(idx) {
  const data = ORD_DATA[setningCurrentGroup];
  setningNum = Math.ceil(Math.random() * 3);
  if ((S.mode.setning || 'lytte') === 'lytte') {
    playAudio(`audio/ord/${S.voice}/${data.audio[idx]}${setningNum}.mp3`, 'setning');
    highlightWordCell('setning-grid', idx);
  } else {
    setningGuess(idx);
  }
}

function setningStart() {
  const data = ORD_DATA[setningCurrentGroup];
  const ex = exercises.setning;
  if (!ex || ex.current === -1) {
    initExercise('setning', shuffle(Array.from({length: data.display.length}, (_, i) => i)), Math.min(12, data.display.length));
  }
  setningNext();
}

function setningNext() {
  const ex = exercises.setning;
  if (ex.answered >= ex.total) { showResult('setning'); resetExercise('setning'); return; }
  document.querySelectorAll('#setning-grid .word-cell').forEach(c => c.classList.remove('selected','correct-cell','wrong-cell','highlighted'));
  ex.current = ex.items[ex.answered];
  ex.currentAnswer = ex.current;
  setningNum = Math.ceil(Math.random() * 3);
  renderProgress('setning');
  const btn = document.getElementById('start-btn-setning');
  btn.innerHTML = '<span class="material-icons-round">skip_next</span>Neste';
  btn.classList.remove('pulsing');
  document.getElementById('repeat-btn-setning').disabled = false;
  document.getElementById('fasit-btn-setning').disabled = false;
  const data = ORD_DATA[setningCurrentGroup];
  playAudio(`audio/ord/${S.voice}/${data.audio[ex.current]}${setningNum}.mp3`, 'setning');
}

function setningRepeat() {
  const ex = exercises.setning;
  if (ex?.currentAnswer !== null) {
    const data = ORD_DATA[setningCurrentGroup];
    playAudio(`audio/ord/${S.voice}/${data.audio[ex.currentAnswer]}${setningNum}.mp3`, 'setning');
  }
}

function setningFasit() {
  const ex = exercises.setning;
  if (!ex || ex.currentAnswer === null) return;
  document.querySelectorAll('#setning-grid .word-cell')[ex.currentAnswer]?.classList.add('highlighted');
}

function setningGuess(idx) {
  const ex = exercises.setning;
  if (!ex || ex.currentAnswer === null) return;
  const cells = document.querySelectorAll('#setning-grid .word-cell');
  const isCorrect = idx === ex.currentAnswer;
  cells[idx]?.classList.add(isCorrect ? 'correct-cell' : 'wrong-cell');
  if (!isCorrect) cells[ex.currentAnswer]?.classList.add('highlighted');
  if (isCorrect) ex.correct++;
  ex.history.push(isCorrect);
  ex.answered++;
  ex.currentAnswer = null;
  renderProgress('setning');
  setTimeout(() => setningNext(), 1200);
}

/* ═══════════════════════════════════════════
   MODULE: ORDPAR (Word Pairs)
   ═══════════════════════════════════════════ */
const ORDPAR_DATA = [
  { name: "S + vokal", type: "-s-", data: [["søk","øk"],["sånn","ånd"],["si","i"],["sagn","agn"],["sår","år"],["sak","ak"],["selv","el"],["sand","and"],["sen","en"],["sær","er"],["sett","ett"],["som","om"],["sopp","opp"],["sunn","unn"],["søm","øm"],["sul","ul"],["selv","el"],["sør","ør"],["så","å"],["sull","ull"]] },
  { name: "Vokal + S", type: "s-", data: [["vis","vi"],["les","le"],["rus","ru"],["dis","di"],["meis","mei"],["ris","ri"],["los","lo"],["flis","fli"],["tøys","tøy"],["ros","ro"],["is","i"],["brus","bru"],["lås","lå"],["taus","tau"],["frøs","frø"],["vas","hva"],["dus","du"],["lys","ly"],["røys","røy"],["gås","gå"]] },
  { name: "N + vokal", type: "-n-", data: [["ni","i"],["narr","arr"],["nord","ord"],["nask","ask"],["nett","ett"],["natt","at"],["naust","aust"],["nek","ek"],["norm","orm"],["nål","ål"],["nes","es"],["nær","er"],["når","år"],["nekte","ekte"],["nikke","ikke"],["neie","eie"],["nese","ese"],["nære","ære"],["nøde","øde"],["nise","ise"]] },
  { name: "Vokal + N", type: "n-", data: [["han","ha"],["din","di"],["land","la"],["ren","re"],["min","mi"],["ran","ra"],["sin","si"],["syn","sy"],["grein","grei"],["vin","vi"],["brun","bru"],["svin","svi"],["dun","du"],["lyn","ly"],["bryn","bry"],["lån","lå"],["gryn","gry"],["gjøn","gjø"],["klin","kli"],["tren","tre"]] },
  { name: "S og N", type: "s-n-", data: [["sag","nag"],["si","ni"],["sær","nær"],["sett","nett"],["sår","når"],["sull","null"],["sal","nal"],["snegl","negl"],["sut","nut"],["så","nå"],["snek","nek"],["savn","navn"],["ses","nes"],["satt","natt"],["snor","nord"],["sy","ny"],["sei","nei"],["sot","not"],["Sam","nam"],["snakke","nakke"]] },
  { name: "T + vokal", type: "-t-", data: [["tatt","at"],["tau","au"],["tro","ro"],["ti","i"],["telt","elt"],["tarm","arm"],["tinn","inn"],["Tor","ord"],["tran","ran"],["tett","ett"],["trø","rød"],["trå","rå"],["tung","ung"],["tur","ur"],["tog","og"],["tyr","yr"],["tær","er"],["tøm","øm"],["tår","år"],["tøy","øy"]] },
  { name: "Vokal + T", type: "t-", data: [["feit","fei"],["hvit","vi"],["snøt","snø"],["lot","lo"],["leit","lei"],["lit","li"],["blått","blå"],["greit","grei"],["krot","kro"],["heit","hei"],["mot","mo"],["bløt","blø"],["rot","ro"],["flaut","flau"],["nyt","ny"],["skjøt","sjø"],["bot","bo"],["støt","stø"],["låt","lå"],["høyt","høy"]] },
  { name: "T og N", type: "t-n-", data: [["tatt","natt"],["ti","ni"],["tøff","nøff"],["tett","nett"],["Tor","nord"],["tål","nål"],["tær","nær"],["tår","når"],["tatt","natt"],["taust","naust"],["tøs","nøs"],["tese","nese"],["tikk","nikk"],["tam","nam"],["tupp","nupp"],["type","nype"],["tusse","nusse"],["tavle","navle"],["teppe","neppe"],["tappe","nappe"]] },
  { name: "S og T", type: "s-t-", data: [["sa","ta"],["si","ti"],["sand","tann"],["sær","tær"],["sett","tett"],["sår","tår"],["sopp","topp"],["salg","talg"],["sut","tut"],["sør","tør"],["sang","tang"],["sull","tull"],["søm","tøm"],["syr","tyr"],["saus","taus"],["sur","tur"],["sak","tak"],["synd","tynn"],["sau","tau"],["se","te"]] },
  { name: "D + vokal", type: "-d-", data: [["dis","is"],["dale","ale"],["dau","au"],["døv","øv"],["de","i"],["deg","ei"],["dør","ør"],["der","er"],["djerv","jerv"],["dum","om"],["dram","ram"],["drev","rev"],["dose","ose"],["dur","ur"],["dask","ask"],["dorm","orm"],["dyr","yr"],["datt","at"],["dum","om"],["drake","rake"]] },
  { name: "Vokal + D", type: "d-", data: [["bad","ba"],["leid","lei"],["syd","sy"],["flod","flo"],["rad","ra"],["sed","se"],["vad","hva"],["led","le"],["flid","fli"],["greid","grei"],["tid","ti"],["lad","la"],["rud","ru"],["eid","ei"],["bod","bo"],["bed","be"],["Aud","au"],["brud","bru"],["lyd","ly"],["råd","rå"]] },
  { name: "D og S", type: "d-s-", data: [["dag","sag"],["dus","sus"],["ditt","sitt"],["dal","sal"],["del","sel"],["dokk","sokk"],["din","sin"],["dau","sau"],["deg","seg"],["dur","sur"],["dør","sør"],["den","send"],["dyr","syr"],["dom","som"],["der","sær"],["døm","søm"],["dekk","sekk"],["dikt","sikt"],["dorg","sorg"],["døl","søl"]] },
  { name: "D og T", type: "d-t-", data: [["der","tær"],["di","ti"],["dam","tam"],["dull","tull"],["dør","tør"],["dor","Tor"],["døv","tøv"],["dal","tal"],["dau","tau"],["dur","tur"],["dyr","tyr"],["dom","tom"],["den","tenn"],["døm","tøm"],["diske","tiske"],["dunge","tunge"],["daske","taske"],["dikke","tikke"],["dette","tette"],["disse","tisse"]] },
  { name: "M + vokal", type: "-m-", data: [["matt","at"],["mor","or"],["mark","ark"],["mi","i"],["mel","el"],["mos","os"],["mann","and"],["mil","il"],["mai","ai"],["minn","inn"],["mei","ei"],["møy","øy"],["mørk","ørk"],["mal","al"],["marg","arg"],["mær","er"],["mane","ane"],["meie","eie"],["manke","anke"],["maske","aske"]] },
  { name: "P + vokal", type: "-p-", data: [["pil","il"],["park","ark"],["Pål","ål"],["pall","all"],["puff","uff"],["pass","ass"],["pen","en"],["pai","ai"],["pakt","akt"],["plast","last"],["prek","rek"],["plukk","lukk"],["pakk","akk"],["plag","lag"],["pris","ris"],["plass","lass"],["plei","lei"],["prim","rim"],["prek","rek"],["part","art"]] },
  { name: "P og M", type: "p-m-", data: [["park","mark"],["pan","man"],["popp","mopp"],["pilt","milt"],["pi","mi"],["patt","matt"],["på","må"],["pal","mal"],["pål","mål"],["pe","med"],["pest","mest"],["pott","mått"],["pus","mus"],["per","mer"],["pinn","minn"],["putt","mutt"],["pakt","makt"],["pilt","milt"],["pur","mur"],["pil","mil"]] },
  { name: "B + vokal", type: "-b-", data: [["bark","ark"],["bord","ord"],["båt","åt"],["bil","il"],["band","and"],["batt","at"],["bås","ås"],["bær","er"],["ball","all"],["ber","er"],["bind","inn"],["bår","år"],["bask","ask"],["belg","elg"],["bet","et"],["bi","i"],["bør","ør"],["bøy","øy"],["bau","au"],["belt","elt"]] },
  { name: "B og M", type: "b-m-", data: [["bett","mett"],["bask","mask"],["best","mest"],["bår","mår"],["batt","matt"],["bær","mær"],["be","med"],["bål","mål"],["by","my"],["bor","mor"],["bil","mil"],["bot","mot"],["bal","mal"],["be","me"],["bøy","møy"],["busk","musk"],["band","mann"],["bur","mur"],["bunk","munk"],["ber","mer"]] },
  { name: "B og P", type: "b-p-", data: [["bisk","pisk"],["bar","par"],["bil","pil"],["ball","pall"],["bytt","pytt"],["ber","Per"],["bind","pinn"],["be","pe"],["best","pest"],["bisk","pisk"],["bull","pull"],["bol","pol"],["bort","port"],["bark","park"],["bes","pes"],["bunn","pund"],["bart","part"],["bris","pris"],["bur","pur"],["bøs","pøs"]] },
  { name: "SJ + vokal", type: "-sj-", data: [["sjal","al"],["skyt","yt"],["sjakt","akt"],["skjegg","egg"],["sky","y"],["skinn","inn"],["sjarm","arm"],["sjark","ark"],["ski","i"],["sjask","ask"],["skei","ei"],["skjul","ul"],["skjelv","elv"],["skilt","ilt"],["sjøl","øl"],["sjau","au"],["sjakk","akk"],["skjær","er"],["skjør","ør"],["Sjur","ur"]] },
  { name: "S og SJ", type: "s-sj-", data: [["si","ski"],["sild","skill"],["sur","Sjur"],["sær","skjær"],["sel","sjel"],["sønn","skjønn"],["sopp","shop"],["sei","skei"],["sal","sjal"],["sør","skjør"],["sinn","skinn"],["sau","sjau"],["silt","skilt"],["send","skjenn"],["sakk","sjakk"],["sø","sjø"],["sagt","sjakt"],["så","sjå"],["sele","skjele"],["senke","skjenke"]] },
  { name: "B og D", type: "b-d-", data: [["bur","dur"],["bær","der"],["bra","dra"],["busk","dusk"],["bann","dann"],["bunk","dunk"],["Bill","dill"],["ball","dall"],["bytt","dytt"],["bau","dau"],["ber","der"],["besk","desk"],["bin","din"],["bæ","dæ"],["bår","dår"],["byr","dyr"],["bekk","dekk"],["bar","dar"],["bord","dor"],["band","dann"]] },
  { name: "B og G", type: "b-g-", data: [["be","ge"],["bast","gast"],["bang","gang"],["bla","glad"],["ble","gle"],["blod","glo"],["bli","gli"],["ba","ga"],["blø","glø"],["bra","gra"],["bo","god"],["brøt","grøt"],["bre","gre"],["brann","grann"],["bom","gom"],["bru","gru"],["bass","gass"],["bår","går"],["bakk","gakk"],["bal","gal"]] },
  { name: "B og V", type: "b-v-", data: [["be","ved"],["bil","hvil"],["Bill","vill"],["bar","var"],["båt","våt"],["bekk","vekk"],["band","vann"],["batt","vatt"],["båss","Voss"],["bær","vær"],["ball","vald"],["ber","ver"],["bin","vin"],["Bård","vår"],["bekk","vekk"],["bask","vask"],["best","vest"],["by","vy"],["belg","velg"],["bisk","visk"]] },
  { name: "D og G", type: "d-g-", data: [["dal","gal"],["drønn","grønn"],["datt","gatt"],["dra","gra"],["dått","gått"],["dram","gram"],["ditt","gitt"],["dår","går"],["dass","gass"],["dår","går"],["dull","gull"],["det","ge"],["diss","giss"],["dokk","gokk"],["dasse","gasse"],["dane","gane"],["dumme","gomme"],["dreie","greie"],["drue","grue"],["disse","gisse"]] },
  { name: "D og N", type: "d-n-", data: [["di","ni"],["dam","nam"],["do","no"],["du","nu"],["dæ","næ"],["då","nå"],["det","ned"],["dass","nass"],["datt","natt"],["dill","nill"],["der","nær"],["dusk","nusk"],["dytt","nytt"],["der","nær"],["dår","når"],["dor","nord"],["dal","nal"],["dett","nett"],["dull","null"],["dokk","nok"]] },
  { name: "E og Ø", type: "e-o-", data: [["selv","sølv"],["fler","flør"],["kjel","kjøl"],["send","sønn"],["ber","bør"],["lev","løv"],["kler","klør"],["lek","løk"],["med","mø"],["merke","mørke"],["neste","nøste"],["rester","røster"],["renne","rønne"],["tenne","tønne"],["gler","glør"],["mer","mør"],["stev","støv"],["ble","blø"],["spre","sprø"],["ser","sør"]] },
];

let ordparCurrentType = 0;

function initOrdpar() {
  const select = document.getElementById('ordpar-select');
  select.innerHTML = '';
  ORDPAR_DATA.forEach((t, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = t.name;
    if (i === ordparCurrentType) opt.selected = true;
    select.appendChild(opt);
  });
}

function ordparSelectType(val) {
  ordparCurrentType = parseInt(val);
  resetExercise('ordpar');
  document.getElementById('pair-display').style.display = 'none';
  document.getElementById('ordpar-info').style.display = 'block';
}

function ordparStart() {
  const data = ORDPAR_DATA[ordparCurrentType];
  const ex = exercises.ordpar;
  if (!ex || ex.current === -1) {
    initExercise('ordpar', shuffle(Array.from({length: data.data.length}, (_, i) => i)), Math.min(20, data.data.length));
  }
  document.getElementById('ordpar-info').style.display = 'none';
  ordparNext();
}

function ordparNext() {
  const ex = exercises.ordpar;
  if (ex.answered >= ex.total) { showResult('ordpar'); resetExercise('ordpar'); document.getElementById('pair-display').style.display = 'none'; document.getElementById('ordpar-info').style.display = 'block'; return; }

  const data = ORDPAR_DATA[ordparCurrentType];
  ex.current = ex.items[ex.answered];
  const pair = data.data[ex.current];
  ex.currentAnswer = Math.random() < 0.5 ? 0 : 1; // which one to play

  renderProgress('ordpar');

  const display = document.getElementById('pair-display');
  display.style.display = 'flex';
  display.innerHTML = '';
  pair.forEach((word, i) => {
    const opt = document.createElement('div');
    opt.className = 'pair-option';
    opt.textContent = word;
    opt.addEventListener('click', () => ordparGuess(i));
    display.appendChild(opt);
  });

  const btn = document.getElementById('start-btn-ordpar');
  btn.innerHTML = '<span class="material-icons-round">skip_next</span>Neste';
  btn.classList.remove('pulsing');
  document.getElementById('repeat-btn-ordpar').disabled = false;

  // Play audio - use type prefix and 1-based indices
  const typePrefix = ORDPAR_DATA[ordparCurrentType].type;
  const pairIdx = ex.current + 1;
  const wordIdx = ex.currentAnswer + 1;
  playAudio(`audio/ordpar/${S.voice}/${typePrefix}ord${pairIdx}-${wordIdx}.mp3`, 'ordpar');
}

function ordparRepeat() {
  const ex = exercises.ordpar;
  if (!ex || ex.current === -1) return;
  const typePrefix = ORDPAR_DATA[ordparCurrentType].type;
  const pairIdx = ex.current + 1;
  const wordIdx = ex.currentAnswer + 1;
  playAudio(`audio/ordpar/${S.voice}/${typePrefix}ord${pairIdx}-${wordIdx}.mp3`, 'ordpar');
}

function ordparGuess(chosenIdx) {
  const ex = exercises.ordpar;
  if (!ex || ex.currentAnswer === null) return;
  const opts = document.querySelectorAll('#pair-display .pair-option');
  const isCorrect = chosenIdx === ex.currentAnswer;
  opts[chosenIdx]?.classList.add(isCorrect ? 'correct-cell' : 'wrong-cell');
  if (!isCorrect) opts[ex.currentAnswer]?.classList.add('correct-cell');
  if (isCorrect) ex.correct++;
  ex.history.push(isCorrect);
  ex.answered++;
  ex.currentAnswer = null;
  renderProgress('ordpar');
  setTimeout(() => ordparNext(), 1200);
}

/* ═══════════════════════════════════════════
   MODULE: OPPBYGGING (Sentence building)
   ═══════════════════════════════════════════ */
const OPPBYGGING_DATA = {
  'Del 1': [
    { word: 'Ferie', audio: 'ferie', sentences: [
      'Vi reiser på ferie.',
      'Vi reiser på ferie til sommeren.',
      'Vi reiser på ferie til sommeren sammen med venner.',
      'Vi reiser på ferie til sommeren sammen med venner til utlandet.',
      'Vi reiser på ferie til sommeren sammen med venner til utlandet og gleder oss.',
      'Vi reiser på ferie til sommeren sammen med venner til utlandet og gleder oss til nye opplevelser.'
    ]},
    { word: 'Penger', audio: 'penger', sentences: [
      'Penger i banken.',
      'Penger i banken er lurt.',
      'Penger i banken er lurt når du skal handle.',
      'Penger i banken er lurt når du skal handle nye klær.',
      'Penger i banken er lurt når du skal handle nye klær til festen.',
      'Penger i banken er lurt når du skal handle nye klær til festen i morgen.'
    ]},
    { word: 'Kom inn', audio: 'kominn', sentences: [
      'Kom inn snart!',
      'Kom inn snart er du snill!',
      'Kom inn snart er du snill, det er sent!',
      'Kom inn snart er du snill, det er sent, barne-tv begynner!',
      'Kom inn snart er du snill, det er sent, barne-tv begynner om en liten stund!',
      'Kom inn snart er du snill, det er sent, barne-tv begynner om en liten stund, hvis du vil se et.'
    ]},
    { word: 'Bok', audio: 'bok', sentences: [
      'Les denne boken!',
      'Les denne boken, den er god!',
      'Les denne boken, den er god, den får deg til å tenke!',
      'Les denne boken, den er god, den får deg til å tenke på lørdagskos.',
      'Les denne boken, den er god, den får deg til å tenke på lørdagskos selv om det er hverdag.',
      'Les denne boken, den er god, den får deg til å tenke på lørdagskos selv om det er hverdag, jeg liker forfatteren.'
    ]},
    { word: 'Teater', audio: 'teater', sentences: [
      'Jeg skal på teater.',
      'Jeg skal på teater i morgen.',
      'Jeg skal på teater i morgen med min søster.',
      'Jeg skal på teater i morgen med min søster og hennes datter.',
      'Jeg skal på teater i morgen med min søster og hennes datter, og min datter.',
      'Jeg skal på teater i morgen med min søster og hennes datter, og min datter for å se Per Gynt.'
    ]},
    { word: 'Regn', audio: 'regn', sentences: [
      'Det regner.',
      'Det regner i dag.',
      'Det regner mye i dag.',
      'Det regner mye i dag, og vi må ha på regntøy.',
      'Det regner mye i dag, og vi må ha på regntøy og støvler.',
      'Det regner mye i dag, og vi må ha på regntøy og støvler for at vi ikke skal bli våte.'
    ]},
  ],
  'Del 2': [
    { word: 'Leker', audio: 'leker', sentences: [
      'Gutten leker.',
      'Gutten leker med bil.',
      'Gutten leker med bil i barnehagen.',
      'Gutten leker med bil i barnehagen hver dag.',
      'Gutten leker med bil i barnehagen hver dag når han får velge selv.',
      'Når gutten får velge selv, leker han med bil i barnehagen hver dag.'
    ]},
    { word: 'Kino', audio: 'kino', sentences: [
      'Vi skal på kino.',
      'Vi skal på kino i kveld.',
      'Vi skal på kino i morgen kveld.',
      'Vi skal på kino i morgen kveld og se en ny film.',
      'Vi skal på kino i morgen kveld og se en spennende film.',
      'Vi skal på kino i morgen kveld og se en spennende film som jeg har sett før.'
    ]},
    { word: 'Middag', audio: 'middag', sentences: [
      'Vi skal spise middag.',
      'Vi skal spise middag klokken fire.',
      'Vi skal spise fisk til middag klokken fire.',
      'Vi skal spise middag sammen klokken fire på restaurant.',
      'Vi skal spise middag hjemme klokken fire, og vi blir åtte til bords.',
      'Vi skal spise middag hjemme klokken fire, og vi blir åtte til bords hvis alle kommer.'
    ]},
    { word: 'Avtale', audio: 'avtale', sentences: [
      'Jeg har en avtale.',
      'Jeg har ordnet med en avtale.',
      'Jeg har ordnet med en ny avtale.',
      'Jeg har ordnet med en ny avtale til neste onsdag.',
      'Jeg har ordnet med en ny avtale til deg neste onsdag.',
      'Jeg har ordnet med en ny avtale til deg neste onsdag klokka 15.'
    ]},
    { word: 'Tur', audio: 'tur', sentences: [
      'Ut på tur.',
      'Å gå ut på tur.',
      'Jeg liker å gå ut på tur.',
      'Jeg liker å gå ut på tur i all slags vær.',
      'Jeg liker å gå ut på tur i all slags vær sammen med en venninne.',
      'Jeg liker å gå ut på tur i all slags vær sammen med en venninne, spesielt i helgene.'
    ]},
    { word: 'Varmt', audio: 'varmt', sentences: [
      'Det er varmt.',
      'I dag er det varmt vær.',
      'I dag er det passende varmt vær.',
      'I dag synes jeg det er passende varmt vær.',
      'I dag synes jeg det er passende varmt vær til å ta en dukkert i sjøen.',
      'I dag synes jeg det er passende varmt vær til å ta en dukkert i sjøen ved campingplassen.'
    ]},
  ],
};

let oppbyggingGroup = 'Del 1';

function initOppbygging() {
  S.mode.oppbygging = 'lytte';
  renderOrdTabs('oppbygging-tabs', Object.keys(OPPBYGGING_DATA), oppbyggingGroup, (g) => { oppbyggingGroup = g; renderOppbyggingSentences(); });
  renderOppbyggingSentences();
}

function renderOppbyggingSentences() {
  const container = document.getElementById('oppbygging-sentences');
  const words = OPPBYGGING_DATA[oppbyggingGroup];
  container.innerHTML = '';

  words.forEach((item, wordIdx) => {
    const group = document.createElement('div');
    group.className = 'oppbygging-word-group';

    const label = document.createElement('div');
    label.className = 'oppbygging-word-label';
    label.textContent = item.word;
    group.appendChild(label);

    item.sentences.forEach((sentence, levelIdx) => {
      const row = document.createElement('div');
      row.className = 'oppbygging-sentence';
      row.dataset.word = wordIdx;
      row.dataset.level = levelIdx;
      row.innerHTML = `<div class="oppbygging-level">${levelIdx + 1}</div><div class="oppbygging-text">${sentence}</div>`;
      row.addEventListener('click', () => oppbyggingSentenceClick(wordIdx, levelIdx));
      group.appendChild(row);
    });

    container.appendChild(group);
  });
  resetExercise('oppbygging');
}

function oppbyggingSentenceClick(wordIdx, levelIdx) {
  if ((S.mode.oppbygging || 'lytte') === 'lytte') {
    const words = OPPBYGGING_DATA[oppbyggingGroup];
    playAudio(`audio/oppbygging/${S.voice}/${words[wordIdx].audio}${levelIdx + 1}.mp3`, 'oppbygging');
    document.querySelectorAll('#oppbygging-sentences .oppbygging-sentence.selected').forEach(c => c.classList.remove('selected'));
    const el = document.querySelector(`#oppbygging-sentences .oppbygging-sentence[data-word="${wordIdx}"][data-level="${levelIdx}"]`);
    if (el) el.classList.add('selected');
  } else {
    oppbyggingGuess(wordIdx, levelIdx);
  }
}

let oppbyggingCurrentCombo = null;

function oppbyggingStart() {
  const ex = exercises.oppbygging;
  if (!ex || ex.current === -1) {
    // Generate all word+level combos
    const words = OPPBYGGING_DATA[oppbyggingGroup];
    const combos = [];
    words.forEach((_, wi) => {
      for (let li = 0; li < 6; li++) combos.push({ word: wi, level: li });
    });
    initExercise('oppbygging', shuffle(combos), 20);
  }
  oppbyggingNext();
}

function oppbyggingNext() {
  const ex = exercises.oppbygging;
  if (ex.answered >= ex.total) { showResult('oppbygging'); resetExercise('oppbygging'); oppbyggingCurrentCombo = null; return; }

  document.querySelectorAll('#oppbygging-sentences .oppbygging-sentence').forEach(c =>
    c.classList.remove('selected','correct-cell','wrong-cell','highlighted'));

  const combo = ex.items[ex.answered];
  ex.current = combo;
  ex.currentAnswer = combo;
  oppbyggingCurrentCombo = combo;
  renderProgress('oppbygging');

  const btn = document.getElementById('start-btn-oppbygging');
  btn.innerHTML = '<span class="material-icons-round">skip_next</span>Neste';
  btn.classList.remove('pulsing');
  document.getElementById('repeat-btn-oppbygging').disabled = false;
  document.getElementById('fasit-btn-oppbygging').disabled = false;

  const words = OPPBYGGING_DATA[oppbyggingGroup];
  playAudio(`audio/oppbygging/${S.voice}/${words[combo.word].audio}${combo.level + 1}.mp3`, 'oppbygging');
}

function oppbyggingRepeat() {
  if (!oppbyggingCurrentCombo) return;
  const words = OPPBYGGING_DATA[oppbyggingGroup];
  const c = oppbyggingCurrentCombo;
  playAudio(`audio/oppbygging/${S.voice}/${words[c.word].audio}${c.level + 1}.mp3`, 'oppbygging');
}

function oppbyggingFasit() {
  const ex = exercises.oppbygging;
  if (!ex || !ex.currentAnswer) return;
  const c = ex.currentAnswer;
  const el = document.querySelector(`#oppbygging-sentences .oppbygging-sentence[data-word="${c.word}"][data-level="${c.level}"]`);
  if (el) { el.classList.add('highlighted'); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
}

function oppbyggingGuess(wordIdx, levelIdx) {
  const ex = exercises.oppbygging;
  if (!ex || !ex.currentAnswer) return;

  const isCorrect = wordIdx === ex.currentAnswer.word && levelIdx === ex.currentAnswer.level;
  const clicked = document.querySelector(`#oppbygging-sentences .oppbygging-sentence[data-word="${wordIdx}"][data-level="${levelIdx}"]`);
  if (clicked) clicked.classList.add(isCorrect ? 'correct-cell' : 'wrong-cell');

  if (!isCorrect) {
    const correct = document.querySelector(`#oppbygging-sentences .oppbygging-sentence[data-word="${ex.currentAnswer.word}"][data-level="${ex.currentAnswer.level}"]`);
    if (correct) { correct.classList.add('highlighted'); correct.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  }

  if (isCorrect) ex.correct++;
  ex.history.push(isCorrect);
  ex.answered++;
  ex.currentAnswer = null;
  renderProgress('oppbygging');
  setTimeout(() => oppbyggingNext(), 1200);
}

/* ═══════════════════════════════════════════
   MODULE: MILJOLYDER (Environmental sounds)
   ═══════════════════════════════════════════ */
const MILJO_DATA = {
  groups: [
    { name: "Dyrelyder", emoji: "🐾", sounds: [
      { file: "katt", name: "Katt" }, { file: "hund1", name: "Liten hund" }, { file: "ku", name: "Ku" },
      { file: "hund2", name: "Stor hund" }, { file: "and", name: "And" }, { file: "geit", name: "Geit" },
      { file: "sau", name: "Sau" }, { file: "hest", name: "Hest" }, { file: "gris", name: "Gris" },
    ]},
    { name: "Menneskelyder", emoji: "🧑", sounds: [
      { file: "applaus", name: "Applaus" }, { file: "prat", name: "Prat" }, { file: "fottrinn", name: "Fottrinn" },
      { file: "barn_nyser", name: "Barn nyser" }, { file: "trapp", name: "Gå i trapp" }, { file: "vaske_hender", name: "Vaske hender" },
      { file: "door", name: "Banking på dør" }, { file: "dame_kremt", name: "Dame kremter" },
      { file: "mann_snork", name: "Mann snorker" }, { file: "mann_nys", name: "Mann nyser" },
      { file: "dame_ler", name: "Dame ler" }, { file: "mann_ler", name: "Mann ler" },
      { file: "mann_host", name: "Mann hoster" }, { file: "dame_host", name: "Dame hoster" },
    ]},
    { name: "Husholdning", emoji: "🏠", sounds: [
      { file: "klippe_papir", name: "Klippe papir" }, { file: "rive_papir", name: "Rive papir" },
      { file: "bla", name: "Bla i bok" }, { file: "fyrstikk", name: "Fyrstikk" },
      { file: "koke_vann", name: "Koke vann" }, { file: "tappe_vann", name: "Tappe vann" },
      { file: "toalett", name: "Toalett" }, { file: "vanndraaper", name: "Vanndråper" },
      { file: "mynt", name: "Mynt" }, { file: "stovsuger", name: "Støvsuger" },
      { file: "sag", name: "Sag" }, { file: "mikser", name: "Mikser" },
      { file: "symaskin", name: "Symaskin" }, { file: "oppvask", name: "Oppvask" },
      { file: "drill", name: "Drill" }, { file: "motorsag", name: "Motorsag" },
      { file: "glidelaas", name: "Glidelås" }, { file: "hamring", name: "Hamring" },
    ]},
    { name: "Varsling & trafikk", emoji: "🚗", sounds: [
      { file: "roykvarsler", name: "Røykvarsler" }, { file: "printer", name: "Printer" },
      { file: "garasjedoor", name: "Garasjedør" }, { file: "heis", name: "Heis" },
      { file: "trommer", name: "Trommer" }, { file: "brannbil", name: "Brannbil" },
      { file: "sirene1", name: "Sirene 1" }, { file: "sirene2", name: "Sirene 2" },
      { file: "sirene3", name: "Sirene 3" }, { file: "starte_bil", name: "Starte bil" },
      { file: "motorsykkel", name: "Motorsykkel" }, { file: "kjore_bil", name: "Kjøre bil" },
      { file: "baat", name: "Båt" }, { file: "tog", name: "Tog" }, { file: "tute_bil", name: "Tute bil" },
    ]},
  ]
};

function initMiljo() {
  S.mode.miljolyder = 'lytte';
  renderMiljoGrid();
}

function renderMiljoGrid() {
  const container = document.getElementById('miljolyder-content');
  container.innerHTML = '';
  let globalIdx = 0;

  MILJO_DATA.groups.forEach(group => {
    const section = document.createElement('div');
    section.className = 'sound-group';
    section.innerHTML = `<div class="sound-group-title">${group.emoji} ${group.name}</div>`;
    const grid = document.createElement('div');
    grid.className = 'sound-grid';

    group.sounds.forEach(sound => {
      const cell = document.createElement('div');
      cell.className = 'sound-cell';
      cell.dataset.file = sound.file;
      cell.dataset.idx = globalIdx;
      cell.innerHTML = `<span class="sound-name">${sound.name}</span>`;
      cell.addEventListener('click', () => miljoCellClick(sound.file, cell));
      grid.appendChild(cell);
      globalIdx++;
    });

    section.appendChild(grid);
    container.appendChild(section);
  });
}

function miljoCellClick(file, cell) {
  if ((S.mode.miljolyder || 'lytte') === 'lytte') {
    document.querySelectorAll('#miljolyder-content .sound-cell').forEach(c => c.classList.remove('selected'));
    cell.classList.add('selected');
    playAudio(`audio/miljolyder/${file}.mp3`, 'miljolyder');
  } else {
    miljoGuess(file);
  }
}

// Build flat list for exercise
function getMiljoFlatList() {
  const list = [];
  MILJO_DATA.groups.forEach(g => g.sounds.forEach(s => list.push(s)));
  return list;
}

function miljoStart() {
  const list = getMiljoFlatList();
  const ex = exercises.miljolyder;
  if (!ex || ex.current === -1) {
    initExercise('miljolyder', shuffle(Array.from({length: list.length}, (_, i) => i)), 20);
  }
  miljoNext();
}

function miljoNext() {
  const ex = exercises.miljolyder;
  if (ex.answered >= ex.total) {
    showResult('miljolyder');
    resetExercise('miljolyder');
    document.getElementById('miljolyder-quiz').innerHTML = '';
    return;
  }
  const list = getMiljoFlatList();
  ex.current = ex.items[ex.answered];
  ex.currentAnswer = list[ex.current].file;
  renderProgress('miljolyder');

  const btn = document.getElementById('start-btn-miljolyder');
  btn.innerHTML = '<span class="material-icons-round">skip_next</span>Neste';
  btn.classList.remove('pulsing');
  document.getElementById('repeat-btn-miljolyder').disabled = false;
  document.getElementById('fasit-btn-miljolyder').disabled = false;

  // Build quiz: correct answer + 5 random distractors = 6 options
  const correctIdx = ex.current;
  const distractors = [];
  const allIndices = Array.from({length: list.length}, (_, i) => i).filter(i => i !== correctIdx);
  const shuffledDistractors = shuffle(allIndices);
  for (let i = 0; i < 9 && i < shuffledDistractors.length; i++) {
    distractors.push(shuffledDistractors[i]);
  }
  const options = shuffle([correctIdx, ...distractors]);

  const quiz = document.getElementById('miljolyder-quiz');
  quiz.innerHTML = '';
  options.forEach(idx => {
    const sound = list[idx];
    const card = document.createElement('div');
    card.className = 'miljo-quiz-card';
    card.textContent = sound.name;
    card.dataset.file = sound.file;
    card.addEventListener('click', () => miljoGuess(sound.file));
    quiz.appendChild(card);
  });

  playAudio(`audio/miljolyder/${ex.currentAnswer}.mp3`, 'miljolyder');
}

function miljoRepeat() {
  const ex = exercises.miljolyder;
  if (ex?.currentAnswer) playAudio(`audio/miljolyder/${ex.currentAnswer}.mp3`, 'miljolyder');
}

function miljoFasit() {
  const ex = exercises.miljolyder;
  if (!ex || !ex.currentAnswer) return;
  const card = document.querySelector(`#miljolyder-quiz .miljo-quiz-card[data-file="${ex.currentAnswer}"]`);
  if (card) card.classList.add('highlighted');
}

function miljoGuess(file) {
  const ex = exercises.miljolyder;
  if (!ex || !ex.currentAnswer) return;
  const isCorrect = file === ex.currentAnswer;
  const clickedCard = document.querySelector(`#miljolyder-quiz .miljo-quiz-card[data-file="${file}"]`);
  if (clickedCard) clickedCard.classList.add(isCorrect ? 'correct-cell' : 'wrong-cell');
  if (!isCorrect) {
    const correctCard = document.querySelector(`#miljolyder-quiz .miljo-quiz-card[data-file="${ex.currentAnswer}"]`);
    if (correctCard) correctCard.classList.add('highlighted');
  }
  if (isCorrect) ex.correct++;
  ex.history.push(isCorrect);
  ex.answered++;
  ex.currentAnswer = null;
  renderProgress('miljolyder');
  setTimeout(() => miljoNext(), 1200);
}

/* ═══════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════ */
initTheme();

// Install tip — show once for mobile users not in standalone mode
(function() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
    || window.navigator.standalone === true;
  const dismissed = localStorage.getItem('ci-install-dismissed');
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (!isStandalone && !dismissed && isMobile) {
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const tip = document.createElement('div');
    tip.className = 'install-tip show';
    tip.innerHTML = `
      <div class="install-tip-icon"><span class="material-icons-round">add_to_home_screen</span></div>
      <div class="install-tip-content">
        <div class="install-tip-title">Legg til på hjemskjermen</div>
        <div class="install-tip-desc">${isIOS 
          ? 'Trykk <strong>Del</strong>-knappen og velg <strong>Legg til på Hjem-skjerm</strong> for best opplevelse.' 
          : 'Trykk menyen <strong>(&#8942;)</strong> og velg <strong>Legg til på startskjermen</strong> for best opplevelse.'}</div>
      </div>
      <button class="install-tip-close" onclick="this.parentElement.remove(); localStorage.setItem('ci-install-dismissed','1')">
        <span class="material-icons-round">close</span>
      </button>`;
    document.body.appendChild(tip);
    
    // Auto-dismiss after 15 seconds
    setTimeout(() => { if (tip.parentElement) tip.remove(); }, 15000);
  }
})();
