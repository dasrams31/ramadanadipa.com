/* ═══════════════════════════════════════════════════════════
   MAIN — preloader, per-section signature entrances,
   alternating slash transitions, 3D tilt, counters,
   cursor, menu.
   ═══════════════════════════════════════════════════════════ */
(() => {
  gsap.registerPlugin(ScrollTrigger);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ── Preloader ── */
  const preloader = document.getElementById('preloader');
  const preFill = document.getElementById('preBarFill');
  const preCount = document.getElementById('preCount');
  let progress = 0, sceneReady = false, pageLoaded = false, introDone = false;

  window.addEventListener('scene-ready', () => { sceneReady = true; maybeIntro(); });
  window.addEventListener('load', () => { pageLoaded = true; maybeIntro(); });
  setTimeout(() => { sceneReady = true; pageLoaded = true; maybeIntro(); }, 6000); // failsafe

  const tick = setInterval(() => {
    progress = Math.min(progress + Math.random() * 14, 90);
    preFill.style.width = progress + '%';
    preCount.textContent = String(Math.floor(progress)).padStart(2, '0');
    if (progress >= 90) clearInterval(tick);
  }, 160);

  function maybeIntro() {
    if (introDone || !sceneReady || !pageLoaded) return;
    introDone = true;
    clearInterval(tick);
    preFill.style.width = '100%';
    preCount.textContent = '100';
    setTimeout(() => {
      preloader.classList.add('done');
      sweepSlash(true);
      heroIntro();
    }, 350);
  }

  /* ── Hero intro ── */
  gsap.set('#hero .reveal-line > span', { yPercent: 115 });
  gsap.set(['.hero-kanji-bg', '.hero-enso', '.side-rail', '.scroll-hint', '#nav'], { opacity: 0 });

  function heroIntro() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.to('#nav', { opacity: 1, duration: 0.8 }, 0)
      .to('#hero .reveal-line > span', { yPercent: 0, duration: 1.15, stagger: 0.12 }, 0.1)
      .to(['.hero-kanji-bg', '.hero-enso'], { opacity: 1, duration: 1.6 }, 0.4)
      .to(['.side-rail', '.scroll-hint'], { opacity: 1, duration: 1 }, 0.9);
    if (reduced) tl.progress(1);
  }

  /* ── Section heads: shared elegant rise ── */
  document.querySelectorAll('.sec-head').forEach((head) => {
    gsap.from(head.children, {
      y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, clearProps: 'transform,opacity',
      scrollTrigger: { trigger: head, start: 'top 86%' },
    });
  });

  /* ── Signature entrances, one per section ── */
  const ST = (trigger, start = 'top 88%') => ({ trigger, start });

  // 一 TENTANG — avatar circle-wipe, text rise, stats pop, edu slide-in
  (() => {
    const sec = '#tentang';
    const av = document.querySelector(sec + ' .about-avatar');
    if (av) gsap.from(av, { clipPath: 'circle(0% at 50% 50%)', scale: 0.94, duration: 1.15, ease: 'power3.inOut', scrollTrigger: ST(av, 'top 85%') });
    gsap.from(sec + ' .about-body > p, ' + sec + ' .about-body > .lead',
      { y: 34, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, scrollTrigger: ST(sec + ' .about-body', 'top 85%') });
    gsap.from(sec + ' .stat',
      { scale: 0.82, opacity: 0, duration: 0.65, ease: 'back.out(1.7)', stagger: 0.08, clearProps: 'transform,opacity', scrollTrigger: ST(sec + ' .stats') });
    gsap.from(sec + ' .edu li',
      { x: -44, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, clearProps: 'transform,opacity', scrollTrigger: ST(sec + ' .edu') });
  })();

  // 二 PROYEK — 3D flip-in cards
  (() => {
    const sec = '#proyek';
    gsap.from(sec + ' .featured-grid .pcard, ' + sec + ' .project-grid .pcard', {
      rotationX: -62, opacity: 0, y: 50, transformPerspective: 1000, transformOrigin: 'center top',
      duration: 1, ease: 'power3.out', clearProps: 'transform,opacity', stagger: 0.09,
      scrollTrigger: ST(sec + ' .featured-grid', 'top 85%'),
    });
    gsap.from(sec + ' .project-grid .pcard', {
      rotationX: -62, opacity: 0, y: 50, transformPerspective: 1000, transformOrigin: 'center top',
      duration: 1, ease: 'power3.out', clearProps: 'transform,opacity', stagger: 0.08,
      scrollTrigger: ST(sec + ' .project-grid', 'top 88%'),
    });
  })();

  // 三 PENGALAMAN — slide from left + red line draw
  (() => {
    const sec = '#pengalaman';
    gsap.from(sec + ' .titem',
      { x: -64, opacity: 0, duration: 0.85, ease: 'power3.out', stagger: 0.12, clearProps: 'transform,opacity', scrollTrigger: ST(sec + ' .timeline', 'top 82%') });
    ScrollTrigger.create({
      trigger: sec + ' .timeline', start: 'top 78%', end: 'bottom 60%', scrub: 0.6,
      onUpdate: (self) => {
        const line = document.querySelector('.tline');
        if (line) line.style.setProperty('--draw', self.progress.toFixed(3));
      },
    });
  })();

  // 四 KEAHLIAN — materialize (scale + de-blur)
  (() => {
    const sec = '#keahlian';
    gsap.from(sec + ' .skill', {
      scale: 0.82, opacity: 0, filter: 'blur(8px)', duration: 0.85, ease: 'power3.out', stagger: 0.07, clearProps: 'transform,opacity,filter',
      scrollTrigger: ST(sec + ' .skill-grid', 'top 86%'),
    });
  })();

  // 五 PENGHARGAAN — slide from right
  (() => {
    const sec = '#penghargaan';
    gsap.from(sec + ' .award',
      { x: 72, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, clearProps: 'transform,opacity', scrollTrigger: ST(sec + ' .award-list', 'top 86%') });
  })();

  // 六 PUBLIKASI — unfold from top
  (() => {
    const sec = '#publikasi';
    const paper = document.querySelector(sec + ' .paper');
    if (paper) gsap.from(paper,
      { scaleY: 0.55, opacity: 0, transformOrigin: 'center top', duration: 1.05, ease: 'power3.inOut', clearProps: 'transform,opacity', scrollTrigger: ST(paper, 'top 86%') });
  })();

  // 七 KONTAK — rising lines, staggered
  (() => {
    const sec = '#kontak';
    gsap.from(sec + ' .contact-main > *',
      { y: 42, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, clearProps: 'transform,opacity', scrollTrigger: ST(sec + ' .contact-main', 'top 86%') });
    gsap.from(sec + ' .contact-links a',
      { y: 36, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.09, clearProps: 'transform,opacity', scrollTrigger: ST(sec + ' .contact-links', 'top 88%') });
  })();

  // Footer gentle fade
  gsap.from('#footer > *', {
    y: 24, opacity: 0, duration: 0.8, ease: 'power2.out', stagger: 0.1, clearProps: 'transform,opacity',
    scrollTrigger: { trigger: '#footer', start: 'top 94%' },
  });

  /* ── Slash transitions, alternating direction ── */
  const slash = document.getElementById('slash');
  let slashing = false;
  function sweepSlash(forward = true) {
    if (slashing || reduced) return;
    slashing = true;
    gsap.fromTo(slash,
      { x: forward ? '-40vw' : '160vw', opacity: 1 },
      {
        x: forward ? '160vw' : '-40vw', duration: 0.55, ease: 'power3.in',
        onComplete: () => { gsap.set(slash, { opacity: 0 }); slashing = false; },
      });
  }
  document.querySelectorAll('.section').forEach((sec, i) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 62%',
      onEnter: () => sweepSlash(i % 2 === 0),
    });
  });

  /* ── Active nav link ── */
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  document.querySelectorAll('.section[id]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 55%', end: 'bottom 55%',
      onToggle: (self) => {
        if (!self.isActive) return;
        navAnchors.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id));
      },
    });
  });

  /* ── 3D tilt cards ── */
  if (finePointer && !reduced) {
    document.querySelectorAll('.tilt').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, { rotateY: px * 10, rotateX: -py * 10, transformPerspective: 900, duration: 0.4, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1,0.5)' });
      });
    });
  }

  /* ── Counters ── */
  document.querySelectorAll('.stat-num').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 1.8, ease: 'power2.out',
          onUpdate: () => { el.textContent = obj.v.toFixed(decimals); },
        });
      },
    });
  });

  /* ── Custom cursor ── */
  if (finePointer) {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    const dx = gsap.quickTo(dot, 'x', { duration: 0.08 }), dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3' });
    window.addEventListener('pointermove', (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); }, { passive: true });
    document.querySelectorAll('a, button, [data-hover]').forEach((el) => {
      el.addEventListener('pointerenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('pointerleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ── Magnetic buttons ── */
  if (finePointer && !reduced) {
    document.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(btn, { x: x * 0.25, y: y * 0.35, duration: 0.4, ease: 'power2.out' });
      });
      btn.addEventListener('pointerleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' });
      });
    });
  }

  /* ── Nav scroll state + mobile menu + scroll progress ── */
  const nav = document.getElementById('nav');
  const prog = document.createElement('div');
  prog.id = 'scroll-progress';
  document.body.appendChild(prog);
  const toTop = document.getElementById('toTop');
  const ttFg = toTop.querySelector('.tt-fg');
  const CIRC = 2 * Math.PI * 19;
  ttFg.style.strokeDasharray = String(CIRC);
  ttFg.style.strokeDashoffset = String(CIRC);
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
  const setProg = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? h.scrollTop / max : 0;
    prog.style.transform = 'scaleX(' + p + ')';
    ttFg.style.strokeDashoffset = String(CIRC * (1 - p));
    toTop.classList.toggle('show', h.scrollTop > 600);
  };
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 40
      ? 'linear-gradient(to bottom, rgba(7,7,8,.94), rgba(7,7,8,.75))'
      : 'linear-gradient(to bottom, rgba(7,7,8,.85), transparent)';
    setProg();
  }, { passive: true });
  setProg();

  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  menuBtn.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    menuBtn.classList.toggle('open', open);
  });
  mobileMenu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuBtn.classList.remove('open');
    }));

  if (reduced) {
    gsap.set(['#hero .reveal-line > span', '.hero-kanji-bg', '.side-rail', '.scroll-hint', '#nav'],
      { clearProps: 'all', opacity: 1, yPercent: 0 });
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }
})();
