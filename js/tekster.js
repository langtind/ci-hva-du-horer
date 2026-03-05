/* ═══════════════════════════════════════════
   MODULE: TEKSTER (Texts with video)
   ═══════════════════════════════════════════ */

let teksterSpeakerIdx = 0;
let teksterVideo = null;
let teksterTimeUpdateHandler = null;

function initTekster() {
  renderTeksterBrowse();
}

function renderTeksterBrowse() {
  const browse = document.getElementById('tekster-browse');
  const player = document.getElementById('tekster-player');
  browse.style.display = '';
  player.style.display = 'none';
  document.getElementById('tekster-title').textContent = 'Tekster';
  document.getElementById('tekster-back-btn').setAttribute('onclick', "navigateTo('home')");

  // Stop any playing video
  if (teksterVideo) {
    teksterVideo.pause();
    teksterVideo.removeEventListener('timeupdate', teksterTimeUpdateHandler);
    teksterVideo = null;
  }

  // Speaker tabs
  let html = '<div class="tekster-speaker-tabs">';
  TEKSTER_DATA.forEach((speaker, idx) => {
    html += `<button class="mode-option${idx === teksterSpeakerIdx ? ' active' : ''}" onclick="teksterSetSpeaker(${idx})">${speaker.speaker}</button>`;
  });
  html += '</div>';

  // Groups and items
  const speaker = TEKSTER_DATA[teksterSpeakerIdx];
  speaker.groups.forEach((group, gIdx) => {
    html += `<div class="tekster-group-label">${group.label}</div>`;
    html += '<div class="tekster-card-grid">';
    group.items.forEach((item, iIdx) => {
      html += `<div class="tekster-card" onclick="openTekst(${teksterSpeakerIdx},${gIdx},${iIdx})">
        <div class="tekster-card-title">${item.title}</div>
        <div class="tekster-card-subtitle">${item.subtitle}</div>
      </div>`;
    });
    html += '</div>';
  });

  browse.innerHTML = html;
}

function teksterSetSpeaker(idx) {
  teksterSpeakerIdx = idx;
  renderTeksterBrowse();
}

function openTekst(sIdx, gIdx, iIdx) {
  const item = TEKSTER_DATA[sIdx].groups[gIdx].items[iIdx];
  const browse = document.getElementById('tekster-browse');
  const player = document.getElementById('tekster-player');
  browse.style.display = 'none';
  player.style.display = '';

  document.getElementById('tekster-title').textContent = item.title;
  document.getElementById('tekster-back-btn').setAttribute('onclick', 'closeTekst()');

  // Build player HTML
  let html = '';
  html += '<div class="tekster-video-wrap" id="tekster-video-wrap">';
  html += `<video id="tekster-video" controls playsinline preload="metadata">
    <source src="${item.videoUrl}" type="video/mp4">
  </video>`;
  html += '</div>';

  html += '<div class="tekster-toggle-bar">';
  html += '<button class="pill-toggle active" onclick="teksterToggleVideo(this)"><span class="material-icons-round">videocam</span>Video</button>';
  html += '<button class="pill-toggle active" onclick="teksterToggleText(this)"><span class="material-icons-round">subject</span>Tekst</button>';
  html += '</div>';

  html += '<div class="tekster-transcript" id="tekster-transcript">';
  item.sentences.forEach((sent, idx) => {
    const clean = sent.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '').trim();
    if (clean) {
      html += `<div class="tekster-sentence" data-idx="${idx}" onclick="teksterJumpTo(${idx})">${clean}</div>`;
    }
  });
  html += '</div>';

  player.innerHTML = html;

  // Setup video sync
  teksterVideo = document.getElementById('tekster-video');
  const timecodes = item.timecodes;

  teksterTimeUpdateHandler = function() {
    const t = teksterVideo.currentTime;
    const sentences = document.querySelectorAll('#tekster-transcript .tekster-sentence');
    let activeIdx = -1;

    for (let i = 0; i < timecodes.length; i++) {
      if (t >= timecodes[i][0] && t <= timecodes[i][1]) {
        activeIdx = i;
        break;
      }
    }

    sentences.forEach(s => s.classList.remove('active'));
    if (activeIdx >= 0) {
      const el = document.querySelector(`.tekster-sentence[data-idx="${activeIdx}"]`);
      if (el) {
        el.classList.add('active');
        // Auto-scroll
        const container = document.getElementById('tekster-transcript');
        const elTop = el.offsetTop - container.offsetTop;
        const scrollTarget = elTop - container.clientHeight / 3;
        container.scrollTo({ top: scrollTarget, behavior: 'smooth' });
      }
    }
  };

  teksterVideo.addEventListener('timeupdate', teksterTimeUpdateHandler);

  // Store timecodes for jump function
  player._timecodes = timecodes;
}

function closeTekst() {
  if (teksterVideo) {
    teksterVideo.pause();
    teksterVideo.removeEventListener('timeupdate', teksterTimeUpdateHandler);
    teksterVideo = null;
  }
  renderTeksterBrowse();
}

function teksterJumpTo(idx) {
  const player = document.getElementById('tekster-player');
  const timecodes = player._timecodes;
  if (teksterVideo && timecodes && timecodes[idx]) {
    teksterVideo.currentTime = timecodes[idx][0];
    teksterVideo.play();
  }
}

function teksterToggleVideo(btn) {
  btn.classList.toggle('active');
  const wrap = document.getElementById('tekster-video-wrap');
  wrap.style.display = btn.classList.contains('active') ? '' : 'none';
}

function teksterToggleText(btn) {
  btn.classList.toggle('active');
  const transcript = document.getElementById('tekster-transcript');
  transcript.style.display = btn.classList.contains('active') ? '' : 'none';
}
