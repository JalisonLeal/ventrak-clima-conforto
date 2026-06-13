// VENTRAK — Um dia a 23°
// Motor da jornada: crossfade de cenas, HUD, parallax, reveals, counters.
// Zero dependências — IntersectionObserver + requestAnimationFrame.

(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const noVideo = reduced || saveData;
  const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;

  const chapters = [...document.querySelectorAll('.chapter')];
  const scenes = [...document.querySelectorAll('.scene')];
  const vids = scenes.map(s => s.querySelector('.scene-video'));
  const chScene = chapters.map(c => +c.dataset.scene);

  const hud = document.getElementById('hud');
  const hudTime = document.getElementById('hudTime');
  const hudPlace = document.getElementById('hudPlace');
  const jFill = document.getElementById('jFill');
  const nav = document.getElementById('nav');

  // ---------- Medidas (cache, recalculado no resize) ----------
  let tops = [], heights = [], docH = 1, vh = innerHeight;

  function measure() {
    vh = innerHeight;
    tops = chapters.map(c => c.offsetTop);
    heights = chapters.map(c => c.offsetHeight);
    docH = Math.max(1, document.documentElement.scrollHeight - vh);
  }

  // ---------- Ciclo de vida dos vídeos ----------
  function ensure(i) {
    // Carrega poster da cena via data-src quando necessário
    const poster = scenes[i]?.querySelector('.scene-poster[data-src]');
    if (poster) { poster.src = poster.dataset.src; delete poster.dataset.src; }

    if (noVideo || i < 0 || i >= vids.length) return;
    const v = vids[i];
    if (!v || v.src) return;
    v.src = v.dataset.src;
    const rate = parseFloat(v.dataset.rate);
    if (rate) v.addEventListener('loadedmetadata', () => { v.playbackRate = rate; }, { once: true });
    v.addEventListener('playing', () => scenes[i].classList.add('live'), { once: true });
    v.load();
  }

  function playV(i) {
    if (noVideo || i < 0) return;
    const v = vids[i];
    if (v && v.src && v.paused) {
      const p = v.play();
      if (p) p.catch(() => {});
    }
  }

  function pauseV(i) {
    const v = vids[i];
    if (v && v.src && !v.paused) v.pause();
  }

  function unload(i) {
    const v = vids[i];
    if (v && v.src) {
      v.pause();
      v.removeAttribute('src');
      v.load();
      scenes[i].classList.remove('live');
    }
  }

  // ---------- Capítulo ativo: HUD + higiene de vídeo ----------
  let cur = -1;

  function setChapter(i) {
    if (i === cur) return;
    cur = i;

    hud.classList.add('swap');
    setTimeout(() => {
      hudTime.textContent = chapters[i].dataset.time;
      hudPlace.textContent = chapters[i].dataset.place;
      hud.classList.remove('swap');
    }, 300);

    const s = chScene[i];
    for (let k = 0; k < vids.length; k++) {
      if (Math.abs(k - s) > 1) unload(k);
    }
    ensure(s - 1); ensure(s); ensure(s + 1);
  }

  // ---------- Loop principal (scroll → rAF) ----------
  let ticking = false;

  function frame() {
    ticking = false;
    const y = scrollY;
    const f = y + vh * 0.5;

    let i = 0;
    for (let k = chapters.length - 1; k >= 0; k--) {
      if (f >= tops[k]) { i = k; break; }
    }
    const t = clamp01((f - tops[i]) / heights[i]);
    setChapter(i);

    const sCur = chScene[i];
    const hasNext = i < chapters.length - 1;
    const blend = hasNext && t > 0.8 ? (t - 0.8) / 0.2 : 0;
    const sNext = hasNext ? chScene[i + 1] : -1;

    for (let k = 0; k < scenes.length; k++) {
      const sc = scenes[k];
      const o = k === sCur ? 1 : (k === sNext ? blend : 0);
      if (o > 0) {
        sc.classList.add('on');
        sc.style.opacity = o;
        if (!reduced) {
          const lt = k === sCur ? t : 0;
          sc.style.transform = `scale(${(1.07 - lt * 0.07).toFixed(4)}) translateY(${((lt - 0.5) * -3).toFixed(2)}vh)`;
        }
      } else if (sc.classList.contains('on')) {
        sc.classList.remove('on');
        sc.style.opacity = 0;
      }
    }

    playV(sCur);
    if (blend > 0) { ensure(sNext); playV(sNext); }
    for (let k = 0; k < vids.length; k++) {
      if (k !== sCur && !(k === sNext && blend > 0)) pauseV(k);
    }

    jFill.style.transform = `scaleY(${clamp01(y / docH).toFixed(4)})`;
    nav.classList.toggle('scrolled', y > 24);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    // rAF não dispara em aba oculta — executa direto para manter o estado coerente
    if (document.hidden) { frame(); return; }
    requestAnimationFrame(frame);
  }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { measure(); onScroll(); }, { passive: true });

  // ---------- Reveals ----------
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });
  chapters.forEach(c => io.observe(c));

  // ---------- Counters ----------
  const cio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const el = e.target;
      const target = +el.dataset.count;
      if (reduced) { el.textContent = target; return; }
      const t0 = performance.now();
      const dur = 1500;
      const step = now => {
        const p = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

  // ---------- Botões magnéticos ----------
  if (!reduced && matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn-mag').forEach(b => {
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / r.width;
        const yy = (e.clientY - r.top - r.height / 2) / r.height;
        b.style.transform = `translate(${(x * 10).toFixed(1)}px, ${(yy * 8).toFixed(1)}px)`;
      }, { passive: true });
      b.addEventListener('mouseleave', () => { b.style.transform = ''; });
    });
  }

  // ---------- Menu mobile ----------
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.addEventListener('click', e => {
    if (e.target.closest('a')) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // ---------- Aba oculta: pausa tudo ----------
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      for (let k = 0; k < vids.length; k++) pauseV(k);
    } else {
      onScroll();
    }
  });

  // ---------- Boot ----------
  measure();
  frame();
  chapters[0].classList.add('in');

  // O vídeo da hero só carrega depois do load — o poster é o LCP
  addEventListener('load', () => {
    measure();
    frame();
    const idle = window.requestIdleCallback || (fn => setTimeout(fn, 500));
    idle(() => { ensure(0); playV(0); });
  });
})();
