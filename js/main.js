/* =================================================================
   Anoushka Dey — Portfolio
   cover (paper collage) → pixel wipe → boot → desktop (window manager)
   ================================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------------
     Links: paste Anoushka's real links here and they appear in the
     contact window and start menu automatically. Leave blank to hide.
     --------------------------------------------------------------- */
  const LINKS = {
    linkedin: '', // e.g. 'https://www.linkedin.com/in/your-handle'
    email: ''     // e.g. 'name@example.com'
  };

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const mobileMQ = matchMedia('(max-width: 760px)');
  const isMobile = () => mobileMQ.matches;

  const cover = $('#cover');
  const desktop = $('#desktop');
  const bootEl = $('#boot');
  const PAPER = ['#f7cf31', '#f5b5c8', '#bfe6f3', '#1d3f93', '#e5433b', '#f4f0c8', '#58ad4f'];

  document.documentElement.classList.add('js');
  Pixels.hydrate();
  document.documentElement.style.setProperty('--cur-arrow', Pixels.cursorURL('arrow', 2, 1, 1, 'default'));
  document.documentElement.style.setProperty('--cur-hand', Pixels.cursorURL('hand', 2, 11, 1, 'pointer'));

  let busy = false;
  let screen = 'cover';

  /* ---------------------------------------------------------------
     Toast
     --------------------------------------------------------------- */
  let toastT;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.hidden = false;
    t.style.animation = 'none';
    void t.offsetWidth;
    t.style.animation = '';
    clearTimeout(toastT);
    toastT = setTimeout(() => { t.hidden = true; }, 1800);
  }

  /* ---------------------------------------------------------------
     Links
     --------------------------------------------------------------- */
  function applyLinks() {
    $$('[data-link]').forEach(a => {
      const key = a.dataset.link;
      const val = (LINKS[key] || '').trim();
      if (!val) {
        const li = a.closest('li');
        if (li) li.hidden = true; else a.hidden = true;
        return;
      }
      a.href = key === 'email' ? 'mailto:' + val : val;
    });
    if (LINKS.linkedin) $('#contactFind').hidden = true;
    if (!LINKS.linkedin && !LINKS.email) $('#contactLinks').hidden = true;
  }

  /* ---------------------------------------------------------------
     COVER
     --------------------------------------------------------------- */
  function paperize(el, colors, shadows) {
    const text = el.textContent.trim();
    el.textContent = '';
    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = text;
    el.appendChild(sr);
    let i = 0;
    text.split(' ').forEach((word, wi) => {
      if (wi) el.appendChild(document.createTextNode(' '));
      const w = document.createElement('span');
      w.className = 'pw';
      w.setAttribute('aria-hidden', 'true');
      Array.from(word).forEach(ch => {
        const s = document.createElement('span');
        s.textContent = ch;
        s.style.setProperty('--pc', colors[i % colors.length]);
        if (shadows) s.style.setProperty('--ps', shadows[i % shadows.length]);
        s.style.setProperty('--pr', (((i * 37) % 9) - 4) * 1.2 + 'deg');
        w.appendChild(s);
        i++;
      });
      el.appendChild(w);
    });
  }
  paperize($('.cpop-name'), ['#1d3f93', '#e5433b', '#f7cf31', '#1d3f93', '#58ad4f', '#e5433b'], ['rgba(8,20,40,.28)', 'rgba(8,20,40,.28)', '#1d3f93', 'rgba(8,20,40,.28)', 'rgba(8,20,40,.28)', 'rgba(8,20,40,.28)']);
  paperize($('.warn-word'), ['#e5433b', '#f7cf31', '#1d3f93', '#58ad4f', '#f5b5c8'], ['#1d3f93', '#1d3f93', 'rgba(8,20,40,.3)', '#1d3f93', '#1d3f93']);

  function rng(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = Math.imul(s ^ (s >>> 15), s | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function starPath(seed) {
    const r = rng(seed);
    const pts = [];
    const n = 8;
    for (let i = 0; i < n * 2; i++) {
      const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2 + (r() - 0.5) * 0.18;
      const rad = i % 2 === 0 ? 44 + r() * 6 : 15 + r() * 9;
      pts.push((50 + Math.cos(a) * rad).toFixed(1) + ' ' + (50 + Math.sin(a) * rad).toFixed(1));
    }
    return 'M' + pts.join(' L') + ' Z';
  }
  const STARS = [
    { x: 7, y: 47, s: 66, d: 30 }, { x: 23, y: 86, s: 46, d: 50 }, { x: 35, y: 9, s: 38, d: 22 },
    { x: 66, y: 91, s: 58, d: 42 }, { x: 74, y: 12, s: 72, d: 34 }, { x: 93, y: 38, s: 48, d: 56 },
    { x: 88, y: 66, s: 34, d: 18 }, { x: 4, y: 88, s: 30, d: 60 }, { x: 52, y: 4, s: 30, d: 44 },
    { x: 29, y: 58, s: 26, d: 20 }, { x: 61, y: 30, s: 22, d: 64 }
  ];
  const starsEl = $('#coverStars');
  const stars = STARS.map((c, i) => {
    const el = document.createElement('span');
    el.className = 'cstar';
    el.style.left = c.x + '%';
    el.style.top = c.y + '%';
    el.style.setProperty('--sz', c.s + 'px');
    el.style.setProperty('--d', (0.5 + i * 0.09).toFixed(2) + 's');
    el.style.setProperty('--dur', (5 + (i % 4)) + 's');
    el.style.setProperty('--rot0', (-10 - (i % 3) * 4) + 'deg');
    el.style.setProperty('--rot1', (8 + (i % 4) * 3) + 'deg');
    el.style.marginLeft = el.style.marginTop = (-c.s / 2) + 'px';
    el.innerHTML = '<svg viewBox="0 0 100 100"><path fill="currentColor" d="' + starPath(i * 13 + 5) + '"/></svg>';
    starsEl.appendChild(el);
    return { el, depth: c.d };
  });

  const layers = $$('.layer', cover).map(el => ({ el, depth: parseFloat(el.dataset.depth) || 10 }));
  const tilt = $('.cover-art-tilt');
  const chars = $$('.ch', cover).map(el => ({ el, ox: 0, oy: 0, cx: 0, cy: 0 }));
  const pc = $('#paperCursor');

  const pointer = { x: innerWidth / 2, y: innerHeight / 2, has: false };
  const sm = { x: 0, y: 0, cx: innerWidth / 2, cy: innerHeight / 2, lastCx: innerWidth / 2 };
  let coverRAF = 0;
  let frame = 0;

  function measureChars() {
    chars.forEach(c => {
      const r = c.el.getBoundingClientRect();
      c.cx = r.left + r.width / 2 - c.ox;
      c.cy = r.top + r.height / 2 - c.oy;
    });
  }

  function coverLoop(t) {
    coverRAF = requestAnimationFrame(coverLoop);
    frame++;
    let nx, ny;
    if (pointer.has) {
      nx = (pointer.x / innerWidth - 0.5) * 2;
      ny = (pointer.y / innerHeight - 0.5) * 2;
    } else {
      nx = Math.sin(t / 2400) * 0.35;
      ny = Math.cos(t / 3100) * 0.25;
    }
    sm.x += (nx - sm.x) * 0.07;
    sm.y += (ny - sm.y) * 0.07;
    if (!reduce) {
      layers.forEach(l => { l.el.style.translate = (-sm.x * l.depth).toFixed(2) + 'px ' + (-sm.y * l.depth).toFixed(2) + 'px'; });
      stars.forEach(s => { s.el.style.translate = (-sm.x * s.depth).toFixed(2) + 'px ' + (-sm.y * s.depth).toFixed(2) + 'px'; });
      tilt.style.setProperty('--ty', (sm.x * 6).toFixed(2) + 'deg');
      tilt.style.setProperty('--tx', (-sm.y * 5).toFixed(2) + 'deg');

      if (frame % 30 === 1) measureChars();
      const R = Math.max(150, innerWidth * 0.12);
      chars.forEach(c => {
        let tx = 0, ty = 0;
        if (pointer.has) {
          const dx = c.cx - pointer.x, dy = c.cy - pointer.y;
          const d = Math.hypot(dx, dy) || 1;
          const f = Math.max(0, 1 - d / R);
          const push = f * f * 34;
          tx = dx / d * push;
          ty = dy / d * push;
        }
        c.ox += (tx - c.ox) * 0.14;
        c.oy += (ty - c.oy) * 0.14;
        c.el.style.setProperty('--ox', c.ox.toFixed(2) + 'px');
        c.el.style.setProperty('--oy', c.oy.toFixed(2) + 'px');
      });
    }
    if (fine && pointer.has) {
      sm.cx += (pointer.x - sm.cx) * 0.42;
      sm.cy += (pointer.y - sm.cy) * 0.42;
      const vx = sm.cx - sm.lastCx;
      sm.lastCx = sm.cx;
      pc.style.transform = 'translate(' + (sm.cx - 3).toFixed(1) + 'px,' + (sm.cy - 3).toFixed(1) + 'px) rotate(' + clamp(vx * 0.8, -18, 18).toFixed(1) + 'deg)';
    }
  }

  function onCoverMove(e) {
    if (e.pointerType === 'touch') return;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    if (!pointer.has) {
      pointer.has = true;
      sm.cx = e.clientX; sm.cy = e.clientY;
      if (fine) cover.classList.add('has-cursor');
    }
    pc.classList.toggle('is-hot', !!e.target.closest('button, .ch, .cstar'));
  }
  cover.addEventListener('pointermove', onCoverMove);
  cover.addEventListener('pointerleave', () => { pointer.has = false; cover.classList.remove('has-cursor'); });

  chars.forEach(c => c.el.addEventListener('click', () => {
    c.el.animate([
      { transform: 'none' },
      { transform: 'translateY(-.25em) rotate(200deg) scale(1.15)' },
      { transform: 'rotate(360deg)' }
    ], { duration: 800, easing: 'cubic-bezier(.34,1.56,.64,1)' });
  }));
  stars.forEach(s => s.el.addEventListener('click', () => {
    s.el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.6) rotate(90deg)' }, { transform: 'scale(1)' }], { duration: 600, easing: 'cubic-bezier(.34,1.56,.64,1)' });
  }));
  $$('.cpop-x', cover).forEach(b => b.addEventListener('click', () => {
    b.closest('.cpop').animate([
      { transform: 'none' }, { transform: 'rotate(-6deg) scale(1.04)' }, { transform: 'rotate(5deg)' },
      { transform: 'rotate(-3deg)' }, { transform: 'rotate(2deg)' }, { transform: 'none' }
    ], { duration: 600, easing: 'ease-out' });
    toast(b.closest('.cpop-warn') ? 'nope, you have to see it ✦' : "can't close me ✦");
  }));
  $$('[data-enter]').forEach(b => b.addEventListener('click', enterDesktop));

  let settleT;
  function playCoverIntro() {
    cover.classList.remove('is-in', 'is-settled');
    $$('.ch, .cpop, .cover-art, .cstar', cover).forEach(el => el.getAnimations().forEach(a => a.cancel()));
    void cover.offsetWidth;
    cover.classList.add('is-in');
    clearTimeout(settleT);
    settleT = setTimeout(() => { measureChars(); }, 1900);
  }

  function startCover() {
    screen = 'cover';
    cover.hidden = false;
    document.body.classList.add('is-cover');
    playCoverIntro();
    cancelAnimationFrame(coverRAF);
    coverRAF = requestAnimationFrame(coverLoop);
  }
  function stopCover() {
    cancelAnimationFrame(coverRAF);
    cover.hidden = true;
    cover.classList.remove('has-cursor');
    document.body.classList.remove('is-cover');
  }

  function scatterCover() {
    if (reduce) return;
    chars.forEach((c, i) => {
      const a = (i / chars.length) * Math.PI * 2 + Math.random();
      c.el.animate([
        { transform: 'none', opacity: 1 },
        { transform: 'translate(' + (Math.cos(a) * innerWidth * 0.6).toFixed(0) + 'px,' + (Math.sin(a) * innerHeight * 0.6 - 120).toFixed(0) + 'px) rotate(' + ((Math.random() - 0.5) * 540).toFixed(0) + 'deg) scale(.6)', opacity: 0 }
      ], { duration: 700, easing: 'cubic-bezier(.55,0,.8,.2)', fill: 'forwards', delay: i * 18 });
    });
    $$('.cpop', cover).forEach(p => p.animate([{ transform: 'none', opacity: 1 }, { transform: 'scale(.3) rotate(12deg)', opacity: 0 }], { duration: 420, easing: 'ease-in', fill: 'forwards' }));
    $('.cover-art', cover).animate([{ transform: 'none' }, { transform: 'scale(1.12) rotate(-3deg)', opacity: 0.4 }], { duration: 750, easing: 'ease-in', fill: 'forwards' });
  }

  /* ---------------------------------------------------------------
     Pixel wipe
     --------------------------------------------------------------- */
  const wipeCv = $('#wipe');
  const wipeG = wipeCv.getContext('2d');
  function wipe(mode, colors, dur) {
    return new Promise(resolve => {
      const W = innerWidth, H = innerHeight;
      if (mode === 'cover') { wipeCv.width = W; wipeCv.height = H; }
      if (reduce) dur = 1;
      const cell = W < 700 ? 24 : 34;
      const cols = Math.ceil(W / cell), rows = Math.ceil(H / cell);
      const cells = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const k = mode === 'cover'
            ? (x / cols) * 0.5 + (y / rows) * 0.2 + Math.random() * 0.3
            : (1 - x / cols) * 0.35 + (y / rows) * 0.35 + Math.random() * 0.3;
          cells.push({ x, y, k });
        }
      }
      cells.sort((a, b) => a.k - b.k);
      const maxK = cells[cells.length - 1].k;
      wipeCv.classList.add('is-busy');
      let i = 0;
      const t0 = performance.now();
      function step(t) {
        const p = Math.min(1, (t - t0) / dur);
        const target = p * maxK;
        while (i < cells.length && cells[i].k <= target) {
          const c = cells[i++];
          if (mode === 'cover') {
            wipeG.fillStyle = colors[(c.x * 7 + c.y * 3 + (c.x * c.y) % 5) % colors.length];
            wipeG.fillRect(c.x * cell, c.y * cell, cell, cell);
          } else {
            wipeG.clearRect(c.x * cell, c.y * cell, cell, cell);
          }
        }
        if (p < 1) requestAnimationFrame(step);
        else {
          if (mode === 'reveal') { wipeG.clearRect(0, 0, W, H); wipeCv.classList.remove('is-busy'); }
          resolve();
        }
      }
      requestAnimationFrame(step);
    });
  }

  function bootWait(ms) {
    return new Promise(resolve => {
      const done = () => { clearTimeout(t); bootEl.removeEventListener('click', done); resolve(); };
      const t = setTimeout(done, reduce ? 200 : ms);
      bootEl.addEventListener('click', done);
    });
  }

  /* ---------------------------------------------------------------
     Screen flow
     --------------------------------------------------------------- */
  let booted = false;
  async function enterDesktop() {
    if (busy || screen !== 'cover') return;
    busy = true;
    scatterCover();
    await sleep(reduce ? 0 : 280);
    await wipe('cover', PAPER, 620);
    stopCover();
    bootEl.hidden = false;
    bootEl.classList.remove('is-out');
    showDesktop();
    await wipe('reveal', null, 480);
    await bootWait(booted ? 900 : 1900);
    booted = true;
    bootEl.classList.add('is-out');
    desktopIntro();
    await sleep(520);
    bootEl.hidden = true;
    busy = false;
  }

  async function logOff() {
    if (busy || screen !== 'desktop') return;
    busy = true;
    closeMenus();
    hideShutdown();
    await wipe('cover', ['#1e51c7', '#245bd9', '#0f8fb0', '#3d86f5', '#f7cf31'], 560);
    hideDesktop();
    startCover();
    await wipe('reveal', null, 520);
    busy = false;
  }

  async function restart() {
    if (busy) return;
    busy = true;
    hideShutdown();
    await wipe('cover', ['#000', '#0b0b12', '#101426'], 480);
    WM.reset();
    bootEl.hidden = false;
    bootEl.classList.remove('is-out');
    await wipe('reveal', null, 300);
    await bootWait(1500);
    bootEl.classList.add('is-out');
    desktopIntro();
    await sleep(520);
    bootEl.hidden = true;
    busy = false;
  }

  let sky;
  function showDesktop() {
    screen = 'desktop';
    desktop.hidden = false;
    desktop.classList.remove('is-crt', 'is-graying');
    if (!sky) sky = new PixelSky($('#sky'));
    else sky.resize();
    sky.start();
    tickClock();
  }
  function hideDesktop() {
    if (sky) sky.stop();
    desktop.hidden = true;
    WM.reset();
    $('#balloon').hidden = true;
  }

  let typed = false;
  function desktopIntro() {
    const ids = isMobile()
      ? ['profile', 'about', 'experience', 'research', 'skills', 'education', 'certs', 'contact', 'new', 'likes', 'opento']
      : ['profile', 'new', 'likes', 'opento'];
    ids.forEach((id, i) => setTimeout(() => WM.open(id, { scroll: false, quiet: true }), reduce ? 0 : 120 + i * (isMobile() ? 60 : 170)));
    setTimeout(() => WM.focus('profile'), reduce ? 0 : 120 + ids.length * 170);
    if (!typed) { typed = true; setTimeout(typeTag, 500); }
    setTimeout(() => showBalloon(), 1600);
  }

  /* ---------------------------------------------------------------
     Window manager
     --------------------------------------------------------------- */
  const WM = (() => {
    const layer = $('#winLayer');
    const tasksEl = $('#tasks');
    const wins = new Map();
    const listeners = [];
    let z = 10;
    let cascade = 0;

    $$('.win', layer).forEach(el => {
      const w = { id: el.dataset.win, el, open: false, min: false, max: false, x: 0, y: 0, placed: false, task: null };
      el.style.setProperty('--w', (el.dataset.w || 480) + 'px');
      wins.set(w.id, w);
      el.addEventListener('pointerdown', () => focus(w.id), true);
      $$('[data-act]', el).forEach(b => b.addEventListener('click', e => {
        e.stopPropagation();
        const a = b.dataset.act;
        if (a === 'close') close(w.id);
        else if (a === 'min') minimize(w.id);
        else if (a === 'max') toggleMax(w.id);
      }));
      const bar = $('[data-drag]', el);
      if (bar) drag(w, bar);
    });

    const emit = (type, id) => listeners.forEach(fn => fn(type, id));
    const bounds = () => ({ W: layer.clientWidth, H: layer.clientHeight });

    function apply(w) {
      w.el.style.setProperty('--x', Math.round(w.x) + 'px');
      w.el.style.setProperty('--y', Math.round(w.y) + 'px');
    }

    function place(w) {
      const { W, H } = bounds();
      const ww = w.el.offsetWidth, hh = w.el.offsetHeight;
      const get = id => wins.get(id);
      let x, y;
      const pr = get('profile');
      const iconsRight = $('#deskIcons').getBoundingClientRect().right;
      const prX = pr.placed ? pr.x : clamp(Math.max(W * 0.14, iconsRight + 18), iconsRight + 12, 280);
      if (!pr.placed) pr.el.style.setProperty('--w', clamp(W - prX - 300, 520, W >= 1700 ? 740 : 640) + 'px');
      const prW = pr.el.offsetWidth || 640;
      const prY = pr.placed ? pr.y : clamp(H * 0.1, 16, 110);
      const right = prX + prW + (W < 1200 ? 18 : 56);
      switch (w.id) {
        case 'profile': x = prX; y = prY; break;
        case 'new':
          x = right + ww + 40 < W ? right : W - ww - 48;
          y = prY + 20; break;
        case 'likes': {
          const n = get('new');
          x = (n.placed ? n.x : right) + 34;
          y = (n.placed ? n.y : prY + 20) + 40;
          if (x + ww > W - 10) x = W - ww - 14;
          break;
        }
        case 'opento': {
          const l = get('likes');
          x = (l.placed ? l.x : right + 34) - 22;
          y = (l.placed ? l.y + l.el.offsetHeight : prY + 300) + 26;
          if (x + ww > W - 10) x = W - ww - 30;
          break;
        }
        default: {
          const k = cascade++ % 6;
          x = W / 2 - ww / 2 + (k - 2) * 32 + 40;
          y = 24 + k * 28;
        }
      }
      w.x = clamp(x, 8, Math.max(8, W - ww - 8));
      w.y = clamp(y, 8, Math.max(8, H - hh - 8));
      w.placed = true;
      apply(w);
    }

    function zoomFrames(w, from) {
      const r = w.el.getBoundingClientRect();
      if (!r.width || !r.height) return null;
      const sx = clamp(from.width / r.width, 0.04, 1);
      const sy = clamp(from.height / r.height, 0.04, 1);
      return [
        { transformOrigin: '0 0', transform: 'translate(' + (from.left - r.left) + 'px,' + (from.top - r.top) + 'px) scale(' + sx + ',' + sy + ')', opacity: 0.2 },
        { transformOrigin: '0 0', transform: 'none', opacity: 1 }
      ];
    }

    function open(id, opts) {
      opts = opts || {};
      const w = wins.get(id);
      if (!w) return;
      closeMenus();
      if (w.open && w.min) return restore(id);
      if (w.open) {
        focus(id);
        if (isMobile()) scrollTo(w);
        else if (!reduce) w.el.animate([{ transform: 'none' }, { transform: 'translateY(-6px)' }, { transform: 'none' }], { duration: 300, easing: 'ease-out' });
        return;
      }
      w.open = true;
      w.min = false;
      if (!w.placed && id !== 'profile') {
        w.el.style.setProperty('--w', Math.round((+w.el.dataset.w || 480) * (innerWidth >= 1700 ? 1.15 : 1)) + 'px');
      }
      w.el.hidden = false;
      if (!isMobile() && !w.placed) place(w);
      focus(id);
      addTask(w);
      w.el.classList.remove('is-shown');
      requestAnimationFrame(() => w.el.classList.add('is-shown'));
      if (!reduce) {
        const src = opts.from && !isMobile() ? opts.from.getBoundingClientRect() : null;
        const frames = src ? zoomFrames(w, src) : null;
        w.el.animate(frames || [
          { transformOrigin: '50% 30%', transform: 'scale(.86) translateY(14px)', opacity: 0 },
          { transformOrigin: '50% 30%', transform: 'none', opacity: 1 }
        ], { duration: src ? 340 : 380, easing: 'cubic-bezier(.2,.9,.25,1.12)' });
      }
      if (isMobile() && opts.scroll !== false) scrollTo(w);
      emit('open', id);
    }

    function close(id) {
      const w = wins.get(id);
      if (!w || !w.open) return;
      w.open = false;
      w.min = false;
      removeTask(w);
      const done = () => {
        if (w.open) return;
        w.el.hidden = true;
        w.el.classList.remove('is-max', 'is-active', 'is-shown');
        w.max = false;
        emit('close', id);
      };
      if (reduce || w.el.hidden) done();
      else w.el.animate([
        { transformOrigin: '50% 40%', transform: 'none', opacity: 1 },
        { transformOrigin: '50% 40%', transform: 'scale(.9)', opacity: 0 }
      ], { duration: 170, easing: 'ease-in' }).finished.then(done, done);
      focusTop();
    }

    function minimize(id) {
      const w = wins.get(id);
      if (!w || !w.open || w.min) return;
      if (isMobile()) return close(id);
      w.min = true;
      w.el.classList.remove('is-active');
      if (w.task) w.task.classList.remove('is-active');
      const done = () => { if (w.min) w.el.hidden = true; emit('min', id); };
      if (reduce || !w.task) done();
      else {
        const f = zoomFrames(w, w.task.getBoundingClientRect());
        if (f) w.el.animate(f.reverse(), { duration: 260, easing: 'cubic-bezier(.5,0,.75,.2)' }).finished.then(done, done);
        else done();
      }
      focusTop();
    }

    function restore(id) {
      const w = wins.get(id);
      if (!w || !w.min) return;
      w.min = false;
      w.el.hidden = false;
      focus(id);
      if (!reduce && w.task) {
        const f = zoomFrames(w, w.task.getBoundingClientRect());
        if (f) w.el.animate(f, { duration: 300, easing: 'cubic-bezier(.2,.9,.25,1.05)' });
      }
      emit('open', id);
    }

    function toggleMax(id) {
      const w = wins.get(id);
      if (!w || isMobile()) return;
      const a = w.el.getBoundingClientRect();
      w.max = !w.max;
      w.el.classList.toggle('is-max', w.max);
      const b = w.el.getBoundingClientRect();
      if (!reduce && b.width && b.height) {
        w.el.animate([
          { transformOrigin: '0 0', transform: 'translate(' + (a.left - b.left) + 'px,' + (a.top - b.top) + 'px) scale(' + (a.width / b.width) + ',' + (a.height / b.height) + ')' },
          { transformOrigin: '0 0', transform: 'none' }
        ], { duration: 260, easing: 'cubic-bezier(.2,.9,.25,1)' });
      }
      focus(id);
    }

    function focus(id) {
      const w = wins.get(id);
      if (!w || !w.open || w.min) return;
      if (z > 2400) {
        const order = Array.from(wins.values()).sort((a, b) => (+a.el.style.zIndex || 0) - (+b.el.style.zIndex || 0));
        z = 10;
        order.forEach(o => { o.el.style.zIndex = ++z; });
      }
      w.el.style.zIndex = ++z;
      wins.forEach(o => {
        const on = o === w;
        o.el.classList.toggle('is-active', on);
        if (o.task) o.task.classList.toggle('is-active', on);
      });
    }

    function focusTop() {
      let best = null;
      wins.forEach(o => {
        if (o.open && !o.min && (!best || (+o.el.style.zIndex || 0) > (+best.el.style.zIndex || 0))) best = o;
      });
      if (best) focus(best.id);
    }

    function addTask(w) {
      if (w.task) return;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'task';
      b.title = w.el.dataset.title;
      b.setAttribute('aria-label', w.el.dataset.title);
      b.innerHTML = Pixels.toSVG(Pixels.ICONS[w.el.dataset.icon] || Pixels.ICONS.note, { scale: 1 }) + '<span></span>';
      b.lastChild.textContent = w.el.dataset.title;
      b.addEventListener('click', () => {
        if (w.min) restore(w.id);
        else if (isMobile()) { focus(w.id); scrollTo(w); }
        else if (w.el.classList.contains('is-active')) minimize(w.id);
        else focus(w.id);
      });
      tasksEl.appendChild(b);
      w.task = b;
    }
    function removeTask(w) {
      if (!w.task) return;
      const t = w.task;
      w.task = null;
      if (reduce) t.remove();
      else t.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.6)' }], { duration: 160 }).finished.then(() => t.remove(), () => t.remove());
    }

    function scrollTo(w) {
      requestAnimationFrame(() => {
        layer.scrollTo({ top: w.el.offsetTop - 10, behavior: reduce ? 'auto' : 'smooth' });
        if (!reduce) w.el.animate([{ boxShadow: '0 0 0 0 rgba(247,207,49,.9)' }, { boxShadow: '0 0 0 8px rgba(247,207,49,0)' }], { duration: 900, delay: 250 });
      });
    }

    function drag(w, bar) {
      let on = false, sx = 0, sy = 0, ox = 0, oy = 0, lastX = 0, vx = 0, raf = 0;
      const tiltLoop = () => {
        vx *= 0.86;
        w.el.style.rotate = clamp(vx * 0.4, -6, 6).toFixed(2) + 'deg';
        if (on) raf = requestAnimationFrame(tiltLoop);
      };
      bar.addEventListener('pointerdown', e => {
        if (isMobile() || w.max || e.button !== 0 || e.target.closest('button')) return;
        on = true;
        sx = e.clientX; sy = e.clientY; ox = w.x; oy = w.y; lastX = e.clientX; vx = 0;
        bar.setPointerCapture(e.pointerId);
        w.el.classList.add('is-dragging');
        cancelAnimationFrame(raf);
        if (!reduce) raf = requestAnimationFrame(tiltLoop);
        e.preventDefault();
      });
      bar.addEventListener('pointermove', e => {
        if (!on) return;
        const { W, H } = bounds();
        const ww = w.el.offsetWidth;
        w.x = clamp(ox + e.clientX - sx, -ww + 100, W - 100);
        w.y = clamp(oy + e.clientY - sy, 0, H - 36);
        vx += (e.clientX - lastX) * 0.5;
        lastX = e.clientX;
        apply(w);
      });
      const end = () => {
        if (!on) return;
        on = false;
        cancelAnimationFrame(raf);
        w.el.classList.remove('is-dragging');
        w.el.style.rotate = '0deg';
      };
      bar.addEventListener('pointerup', end);
      bar.addEventListener('pointercancel', end);
      bar.addEventListener('dblclick', e => {
        if (!e.target.closest('button') && $('.wc-max', w.el)) toggleMax(w.id);
      });
    }

    function reset() {
      wins.forEach(w => {
        w.el.getAnimations().forEach(a => a.cancel());
        w.open = false; w.min = false; w.max = false; w.placed = false;
        w.el.hidden = true;
        w.el.classList.remove('is-max', 'is-active', 'is-shown');
        if (w.task) { w.task.remove(); w.task = null; }
        emit('close', w.id);
      });
      cascade = 0;
      layer.scrollTop = 0;
    }

    function keepInView() {
      if (isMobile()) return;
      const { W, H } = bounds();
      wins.forEach(w => {
        if (!w.placed) return;
        w.x = clamp(w.x, -w.el.offsetWidth + 100, W - 100);
        w.y = clamp(w.y, 0, H - 36);
        apply(w);
      });
    }
    addEventListener('resize', keepInView);

    mobileMQ.addEventListener('change', () => {
      if (screen !== 'desktop') return;
      if (isMobile()) {
        ['profile', 'about', 'experience', 'research', 'skills', 'education', 'certs', 'contact', 'new', 'likes', 'opento']
          .forEach(id => { if (!wins.get(id).open) open(id, { scroll: false }); else if (wins.get(id).min) restore(id); });
      } else {
        wins.forEach(w => { if (w.open && !w.placed) place(w); });
        keepInView();
      }
    });

    return {
      wins, open, close, minimize, restore, focus, reset,
      on: fn => listeners.push(fn),
      list: () => Array.from(wins.values())
    };
  })();

  /* ---------------------------------------------------------------
     Desktop interactions
     --------------------------------------------------------------- */
  const layerEl = $('#winLayer');
  const iconsEl = $('#deskIcons');

  function selectIcon(el) {
    $$('.dicon', iconsEl).forEach(d => d.classList.toggle('is-selected', d === el));
  }

  desktop.addEventListener('click', e => {
    const opener = e.target.closest('[data-open]');
    if (opener) {
      if (opener.classList.contains('dicon')) selectIcon(opener);
      WM.open(opener.dataset.open, { from: opener });
      return;
    }
    const act = e.target.closest('[data-action]');
    if (act) {
      if (act.dataset.action === 'logoff') logOff();
      if (act.dataset.action === 'turnoff') showShutdown();
    }
  });

  // rubber-band selection on the empty desktop
  const selRect = $('#selectRect');
  layerEl.addEventListener('pointerdown', e => {
    if (e.target !== layerEl && e.target !== iconsEl) return;
    closeMenus();
    selectIcon(null);
    if (isMobile() || e.button !== 0 || e.pointerType === 'touch') return;
    const sx = e.clientX, sy = e.clientY;
    const icons = $$('.dicon', iconsEl).map(el => ({ el, r: el.getBoundingClientRect() }));
    layerEl.setPointerCapture(e.pointerId);
    const move = ev => {
      const x = Math.min(sx, ev.clientX), y = Math.min(sy, ev.clientY);
      const w = Math.abs(ev.clientX - sx), h = Math.abs(ev.clientY - sy);
      if (w + h < 4) return;
      selRect.hidden = false;
      Object.assign(selRect.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
      icons.forEach(i => i.el.classList.toggle('is-selected', i.r.left < x + w && i.r.right > x && i.r.top < y + h && i.r.bottom > y));
    };
    const up = () => {
      selRect.hidden = true;
      layerEl.removeEventListener('pointermove', move);
      layerEl.removeEventListener('pointerup', up);
      layerEl.removeEventListener('pointercancel', up);
    };
    layerEl.addEventListener('pointermove', move);
    layerEl.addEventListener('pointerup', up);
    layerEl.addEventListener('pointercancel', up);
  });

  /* start menu + all programs flyout */
  const startBtn = $('#startBtn');
  const startMenu = $('#startMenu');
  const flyout = $('#flyout');
  const allProg = $('#allProgBtn');

  function programItems() {
    return WM.list().map(w => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'menuitem');
      b.dataset.open = w.id;
      b.innerHTML = Pixels.toSVG(Pixels.ICONS[w.el.dataset.icon] || Pixels.ICONS.note, { scale: 1.5 }) + '<span></span>';
      b.lastChild.textContent = w.el.dataset.title.replace(' — Notepad', '');
      return b;
    });
  }
  $('#smPrograms').append(...programItems().map(b => { const li = document.createElement('li'); li.appendChild(b); return li; }));
  flyout.append(...programItems());

  function popIn(el, origin) {
    el.hidden = false;
    if (!reduce) el.animate([
      { transformOrigin: origin, transform: 'scale(.85)', opacity: 0 },
      { transformOrigin: origin, transform: 'none', opacity: 1 }
    ], { duration: 200, easing: 'cubic-bezier(.2,.9,.25,1.1)' });
  }
  function toggleStart(force) {
    const open = force !== undefined ? force : startMenu.hidden;
    closeFlyout();
    if (open) popIn(startMenu, '0 100%');
    else startMenu.hidden = true;
    startBtn.setAttribute('aria-expanded', String(open));
    if (open) { const f = $('button, a:not([hidden])', startMenu); if (f && !fine) f.focus(); }
  }
  function openFlyout() {
    const r = allProg.getBoundingClientRect();
    flyout.hidden = false;
    const fw = flyout.offsetWidth, fh = flyout.offsetHeight;
    let left = r.right + 4, top = r.bottom - fh;
    if (left + fw > innerWidth - 8) { left = clamp(r.left, 8, innerWidth - fw - 8); top = r.top - fh - 4; }
    top = clamp(top, 8, innerHeight - fh - 50);
    flyout.style.left = left + 'px';
    flyout.style.top = top + 'px';
    flyout.hidden = true;
    popIn(flyout, '0 100%');
    allProg.setAttribute('aria-expanded', 'true');
  }
  function closeFlyout() {
    flyout.hidden = true;
    allProg.setAttribute('aria-expanded', 'false');
  }
  function closeMenus() {
    if (!startMenu.hidden) toggleStart(false);
    closeFlyout();
  }
  startBtn.addEventListener('click', e => { e.stopPropagation(); toggleStart(); });
  allProg.addEventListener('click', e => { e.stopPropagation(); if (flyout.hidden) openFlyout(); else closeFlyout(); });
  document.addEventListener('pointerdown', e => {
    if (!e.target.closest('#startMenu, #startBtn, #flyout, #allProgBtn')) closeMenus();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeMenus();
      if (!$('#shutdown').hidden) hideShutdown();
    }
    if (e.key === 'Enter' && screen === 'cover' && !e.target.closest('button')) enterDesktop();
  });

  /* balloon */
  let balloonT;
  function showBalloon() {
    const b = $('#balloon');
    if (screen !== 'desktop') return;
    $('span', b).textContent = isMobile()
      ? 'Tap the icons to jump to a window, or scroll through them all.'
      : "Click the icons or start to explore. Drag windows around, they're real.";
    popIn(b, '90% 100%');
    clearTimeout(balloonT);
    balloonT = setTimeout(() => { b.hidden = true; }, isMobile() ? 5000 : 9000);
  }
  $('.balloon-x').addEventListener('click', () => { $('#balloon').hidden = true; });
  $('#trayHi').addEventListener('click', showBalloon);

  /* clock */
  function tickClock() {
    $('#clock').textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  setInterval(tickClock, 10000);

  /* ---------------------------------------------------------------
     Profile window
     --------------------------------------------------------------- */
  function typeTag() {
    const el = $('#pfTag');
    const text = el.textContent;
    if (reduce) return;
    el.textContent = '';
    let i = 0;
    const t = setInterval(() => {
      el.textContent = text.slice(0, ++i);
      if (i >= text.length) clearInterval(t);
    }, 38);
  }

  const LINES = [
    "hi! I'm Anoushka ✦",
    'stay positive, like a proton',
    "I've got a solution for that",
    'tiny particles, big ideas',
    'chemistry? we have it.',
    'drag the windows around!'
  ];
  let lineI = 0;
  const avatar = $('#pfAvatar');
  avatar.addEventListener('click', () => {
    avatar.classList.remove('is-happy');
    void avatar.offsetWidth;
    avatar.classList.add('is-happy');
    let bub = $('.pf-bubble', avatar.parentElement);
    if (!bub) {
      bub = document.createElement('div');
      bub.className = 'pf-bubble';
      bub.setAttribute('role', 'status');
      avatar.parentElement.appendChild(bub);
    }
    bub.textContent = LINES[lineI++ % LINES.length];
    bub.hidden = false;
    if (!reduce) bub.animate([{ transform: 'scale(.6) translateY(8px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 260, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    clearTimeout(bub._t);
    bub._t = setTimeout(() => { bub.hidden = true; }, 2600);
  });
  avatar.setAttribute('role', 'button');
  avatar.setAttribute('tabindex', '0');
  avatar.setAttribute('aria-label', 'Pixel portrait of Anoushka, click to say hi');
  avatar.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); avatar.click(); } });

  /* ---------------------------------------------------------------
     Experience: accordion + filters
     --------------------------------------------------------------- */
  const exList = $('#exList');
  $$('.ex-row', exList).forEach(btn => btn.addEventListener('click', () => {
    const li = btn.closest('.ex-item');
    const open = !li.classList.contains('is-open');
    li.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
  }));
  $$('.chip').forEach(chip => chip.addEventListener('click', () => {
    $$('.chip').forEach(c => c.classList.toggle('is-on', c === chip));
    const f = chip.dataset.filter;
    const items = $$('.ex-item', exList);
    const before = new Map(items.map(li => [li, li.getBoundingClientRect()]));
    let n = 0;
    items.forEach(li => {
      const show = f === 'all' || li.dataset.tags.split(' ').includes(f);
      li.classList.toggle('is-hidden', !show);
      if (show) n++;
    });
    $('#exCount').textContent = n;
    if (reduce) return;
    items.forEach(li => {
      if (li.classList.contains('is-hidden')) return;
      const a = before.get(li), b = li.getBoundingClientRect();
      if (a.height === 0) li.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: 'ease-out' });
      else if (a.top !== b.top) li.animate([{ transform: 'translateY(' + (a.top - b.top) + 'px)' }, { transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.2,.9,.25,1)' });
    });
  }));

  /* ---------------------------------------------------------------
     Skills inventory
     --------------------------------------------------------------- */
  const invName = $('#invName'), invText = $('#invText');
  $$('.slot').forEach(s => {
    const show = () => {
      $$('.slot').forEach(o => o.classList.toggle('is-picked', o === s));
      invName.textContent = s.dataset.skill;
      invText.textContent = s.dataset.desc;
    };
    s.addEventListener('mouseenter', show);
    s.addEventListener('focus', show);
    s.addEventListener('click', show);
  });

  /* ---------------------------------------------------------------
     Certificates: copy credential id
     --------------------------------------------------------------- */
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(b.dataset.copy);
      toast('credential ID copied ✓');
    } catch (err) {
      const code = b.previousElementSibling;
      const range = document.createRange();
      range.selectNodeContents(code);
      const sel = getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      toast('selected, press ctrl+c');
    }
  }));

  /* ---------------------------------------------------------------
     Recycle bin
     --------------------------------------------------------------- */
  $('#binBtn').addEventListener('click', async () => {
    const btn = $('#binBtn');
    btn.disabled = true;
    const items = $$('#binList li');
    await Promise.all(items.map((li, i) => reduce ? Promise.resolve() :
      li.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(60px) rotate(8deg)' }], { duration: 280, delay: i * 90, easing: 'ease-in', fill: 'forwards' }).finished));
    $('#binList').hidden = true;
    $('#binEmpty').hidden = false;
    btn.hidden = true;
    toast('Recycle Bin emptied ✦');
  });

  /* ---------------------------------------------------------------
     Nano lab: pixel nanoparticles in Brownian motion
     --------------------------------------------------------------- */
  (function nanoLab() {
    const cv = $('#nanoCanvas');
    const g = cv.getContext('2d');
    const W = cv.width, H = cv.height;
    const COLORS = [['#ffd84a', '#b98a10', '#fff3b0'], ['#e8eef7', '#8d9ab0', '#ffffff'], ['#62d46b', '#2e8a3a', '#c9f7c5'], ['#f59ac0', '#b34f7a', '#ffe0ee'], ['#9cc8ff', '#3f6fc6', '#e6f1ff']];
    const sprites = {};
    function sprite(r, ci) {
      const key = r + ':' + ci;
      if (sprites[key]) return sprites[key];
      const s = document.createElement('canvas');
      const d = r * 2 + 1;
      s.width = s.height = d;
      const x = s.getContext('2d');
      const [base, shade, hi] = COLORS[ci];
      for (let yy = -r; yy <= r; yy++) {
        for (let xx = -r; xx <= r; xx++) {
          const q = xx * xx + yy * yy;
          if (q > r * r + r * 0.6) continue;
          x.fillStyle = (xx + yy > r * 0.7) ? shade : base;
          x.fillRect(xx + r, yy + r, 1, 1);
        }
      }
      x.fillStyle = hi;
      x.fillRect(r - Math.ceil(r / 2), r - Math.ceil(r / 2), 1, 1);
      sprites[key] = s;
      return s;
    }
    const parts = [];
    function add(n) {
      for (let i = 0; i < n && parts.length < 150; i++) {
        parts.push({
          x: 6 + Math.random() * (W - 12), y: 6 + Math.random() * (H - 12),
          vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
          r: 1 + Math.floor(Math.random() * 3), c: Math.floor(Math.random() * COLORS.length)
        });
      }
      $('#nanoN').textContent = parts.length;
    }
    add(46);
    let heat = 40;
    const mouse = { x: -99, y: -99, on: false };
    $('#nanoHeat').addEventListener('input', e => { heat = +e.target.value; });
    $('#nanoAdd').addEventListener('click', () => add(12));
    $('#nanoShake').addEventListener('click', () => {
      parts.forEach(p => { p.vx += (Math.random() - 0.5) * 9; p.vy += (Math.random() - 0.5) * 9; });
      if (!reduce) cv.animate([{ transform: 'none' }, { transform: 'translateX(-5px) rotate(-1deg)' }, { transform: 'translateX(5px) rotate(1deg)' }, { transform: 'none' }], { duration: 300 });
    });
    const toCanvas = e => {
      const r = cv.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width * W;
      mouse.y = (e.clientY - r.top) / r.height * H;
    };
    cv.addEventListener('pointermove', e => { mouse.on = true; toCanvas(e); });
    cv.addEventListener('pointerdown', e => { mouse.on = true; toCanvas(e); });
    cv.addEventListener('pointerleave', () => { mouse.on = false; });
    cv.addEventListener('pointerup', e => { if (e.pointerType === 'touch') mouse.on = false; });

    function step() {
      const k = heat / 40;
      for (const p of parts) {
        p.vx += (Math.random() - 0.5) * 0.55 * k;
        p.vy += (Math.random() - 0.5) * 0.55 * k;
        if (mouse.on) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 900) {
            const d = Math.sqrt(d2) || 1;
            const f = (30 - d) / 30 * 1.3;
            p.vx += dx / d * f;
            p.vy += dy / d * f;
          }
        }
        p.vx *= 0.9; p.vy *= 0.9;
        const sp = Math.hypot(p.vx, p.vy), max = 1.2 + k * 1.6;
        if (sp > max) { p.vx *= max / sp; p.vy *= max / sp; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < p.r) { p.x = p.r; p.vx = Math.abs(p.vx); }
        if (p.x > W - p.r - 1) { p.x = W - p.r - 1; p.vx = -Math.abs(p.vx); }
        if (p.y < p.r) { p.y = p.r; p.vy = Math.abs(p.vy); }
        if (p.y > H - p.r - 1) { p.y = H - p.r - 1; p.vy = -Math.abs(p.vy); }
      }
      for (let i = 0; i < parts.length; i++) {
        const a = parts[i];
        for (let j = i + 1; j < parts.length; j++) {
          const b = parts[j];
          const dx = b.x - a.x, dy = b.y - a.y, min = a.r + b.r + 1;
          const d2 = dx * dx + dy * dy;
          if (d2 < min * min && d2 > 0.0001) {
            const d = Math.sqrt(d2), push = (min - d) / 2;
            const ux = dx / d, uy = dy / d;
            a.x -= ux * push; a.y -= uy * push;
            b.x += ux * push; b.y += uy * push;
          }
        }
      }
    }
    function draw() {
      g.fillStyle = '#0d1633';
      g.fillRect(0, 0, W, H);
      g.fillStyle = '#18264f';
      for (let y = 5; y < H; y += 10) for (let x = 5; x < W; x += 10) g.fillRect(x, y, 1, 1);
      for (const p of parts) g.drawImage(sprite(p.r, p.c), Math.round(p.x - p.r), Math.round(p.y - p.r));
      if (mouse.on) {
        g.strokeStyle = 'rgba(255,216,74,.5)';
        g.beginPath();
        g.arc(Math.round(mouse.x) + 0.5, Math.round(mouse.y) + 0.5, 6, 0, Math.PI * 2);
        g.stroke();
      }
    }
    let run = false, raf = 0;
    const loop = () => { step(); draw(); if (run) raf = requestAnimationFrame(loop); };
    draw();
    new IntersectionObserver(entries => {
      const vis = entries[0].isIntersecting;
      if (vis && !run) { run = true; raf = requestAnimationFrame(loop); }
      else if (!vis) { run = false; cancelAnimationFrame(raf); }
    }).observe(cv);
  })();

  /* ---------------------------------------------------------------
     Turn off: stand by / turn off / restart
     --------------------------------------------------------------- */
  const sd = $('#shutdown');
  function showShutdown() {
    if (busy) return;
    closeMenus();
    desktop.classList.add('is-graying');
    sd.hidden = false;
    setTimeout(() => $('.sd-opt', sd).focus(), 50);
  }
  function hideShutdown() {
    desktop.classList.remove('is-graying');
    sd.hidden = true;
  }
  sd.addEventListener('click', e => {
    const b = e.target.closest('[data-sd]');
    if (!b) { if (e.target === sd) hideShutdown(); return; }
    const a = b.dataset.sd;
    if (a === 'cancel') hideShutdown();
    if (a === 'standby') { hideShutdown(); standby(); }
    if (a === 'off') turnOff();
    if (a === 'restart') restart();
  });

  function standby() {
    const s = $('#standby'), dvd = $('#dvd');
    s.hidden = false;
    let x = 40, y = 40, vx = 2.2, vy = 1.8, raf;
    const cols = ['#62d46b', '#f7cf31', '#f5b5c8', '#9cc8ff', '#e5433b', '#f4f0c8'];
    let ci = 0;
    const loop = () => {
      const W = innerWidth - dvd.offsetWidth, H = innerHeight - dvd.offsetHeight;
      x += vx; y += vy;
      let hit = false;
      if (x <= 0 || x >= W) { vx *= -1; x = clamp(x, 0, W); hit = true; }
      if (y <= 0 || y >= H) { vy *= -1; y = clamp(y, 0, H); hit = true; }
      if (hit) dvd.style.color = cols[++ci % cols.length];
      dvd.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const wake = () => {
      cancelAnimationFrame(raf);
      s.hidden = true;
      s.removeEventListener('pointerdown', wake);
      removeEventListener('keydown', wake);
    };
    setTimeout(() => {
      s.addEventListener('pointerdown', wake);
      addEventListener('keydown', wake);
    }, 300);
  }

  async function turnOff() {
    if (busy) return;
    busy = true;
    hideShutdown();
    desktop.classList.add('is-crt');
    await sleep(reduce ? 0 : 720);
    hideDesktop();
    desktop.classList.remove('is-crt');
    screen = 'off';
    $('#offScreen').hidden = false;
    busy = false;
  }
  $('#powerOn').addEventListener('click', async () => {
    if (busy) return;
    busy = true;
    $('#offScreen').hidden = true;
    bootEl.hidden = false;
    bootEl.classList.remove('is-out');
    showDesktop();
    await bootWait(1500);
    bootEl.classList.add('is-out');
    desktopIntro();
    await sleep(520);
    bootEl.hidden = true;
    busy = false;
  });

  /* ---------------------------------------------------------------
     Go
     --------------------------------------------------------------- */
  applyLinks();
  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, sleep(1200)]).then(() => {
    startCover();
    if (location.hash === '#desktop') enterDesktop();
  });
})();
