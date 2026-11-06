/* ═══════════════════════════════════════════════════════════
   3D SCENE v2 — Neo-Samurai: floating katana, sakura petals,
   embers, giant kanji spirit, scroll-driven camera journey.

   Redesign 2026-11-06 (user approved directions 1-3):
   1. Scene upgrade: ember particles, pointer slash burst,
      stronger mouse-follow katana.
   2. 3D-first: per-section camera waypoints computed from the
      real DOM section offsets — the camera travels through
      hero > tentang > proyek > pengalaman > keahlian >
      penghargaan > publikasi > blog > kontak.
   3. Hybrid: all content stays in the HTML DOM (SEO intact);
      Three.js owns hero, transitions and the proyek showcase
      (orbit ring + satellites, visible near the proyek waypoint).

   Contracts kept: dispatches 'scene-ready' (preloader),
   prefers-reduced-motion renders one static frame, animation
   pauses in background tabs, mobile uses fewer particles.
   ═══════════════════════════════════════════════════════════ */
import * as THREE from 'three';

(() => {
  const canvas = document.getElementById('scene3d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(pointer:coarse)').matches || window.innerWidth < 768;
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
  } catch (err) {
    canvas.style.display = 'none';
    window.dispatchEvent(new CustomEvent('scene-ready'));
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b0b0d, 0.055);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 8);

  /* ── Lights ── */
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xf2ede3, 1.1);
  key.position.set(4, 6, 6);
  scene.add(key);
  const rim = new THREE.PointLight(0xe23a2e, 60, 30);
  rim.position.set(-5, -2, 3);
  scene.add(rim);
  const fill = new THREE.PointLight(0x4a6a8a, 20, 25);
  fill.position.set(3, -4, 2);
  scene.add(fill);

  /* ── Katana (built from primitives) ── */
  const katana = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: 0xd8dce2, metalness: 0.95, roughness: 0.22 });
  const steelEdge = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.08, emissive: 0x8899aa, emissiveIntensity: 0.25 });
  const darkWrap = new THREE.MeshStandardMaterial({ color: 0x14161c, metalness: 0.3, roughness: 0.8 });
  const akaMat = new THREE.MeshStandardMaterial({ color: 0xe23a2e, metalness: 0.5, roughness: 0.4 });

  // Blade
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.085, 2.3, 0.016), steel);
  blade.position.y = 1.55;
  katana.add(blade);
  // Cutting edge highlight
  const edge = new THREE.Mesh(new THREE.BoxGeometry(0.012, 2.28, 0.018), steelEdge);
  edge.position.set(0.048, 1.55, 0);
  katana.add(edge);
  // Kissaki (tip)
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.22, 4), steel);
  tip.position.y = 2.8;
  tip.rotation.y = Math.PI / 4;
  tip.scale.z = 0.35;
  katana.add(tip);
  // Habaki (collar)
  const habaki = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.09, 0.035), akaMat);
  habaki.position.y = 0.36;
  katana.add(habaki);
  // Tsuba (guard)
  const tsuba = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.025, 32), darkWrap);
  tsuba.position.y = 0.28;
  katana.add(tsuba);
  const tsubaRing = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.008, 12, 48), akaMat);
  tsubaRing.rotation.x = Math.PI / 2;
  tsubaRing.position.y = 0.28;
  katana.add(tsubaRing);
  // Tsuka (handle)
  const tsuka = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.62, 0.05), darkWrap);
  tsuka.position.y = -0.06;
  katana.add(tsuka);
  // Handle wrap diamonds (red cord)
  for (let i = 0; i < 5; i++) {
    const cord = new THREE.Mesh(new THREE.BoxGeometry(0.082, 0.018, 0.056), akaMat);
    cord.position.y = -0.3 + i * 0.12;
    cord.rotation.z = 0.5;
    katana.add(cord);
  }
  // Kashira (pommel)
  const kashira = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.05, 16), akaMat);
  kashira.position.y = -0.4;
  katana.add(kashira);

  katana.rotation.z = -0.42;
  katana.rotation.y = 0.5;
  const katanaHome = new THREE.Vector3(2.4, 0.1, 0.5);
  katana.position.copy(katanaHome);
  scene.add(katana);

  /* ── Giant background kanji spirit ── */
  function makeKanjiSprite() {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = 'rgba(242,237,227,0.055)';
    ctx.font = "900 400px 'Noto Serif JP', serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('侍', 256, 280);
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 1 });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(9, 9, 1);
    sprite.position.set(-3.4, 0.6, -4);
    return sprite;
  }
  let kanjiSprite = null;
  const addKanji = () => { if (!kanjiSprite) { kanjiSprite = makeKanjiSprite(); scene.add(kanjiSprite); } };
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(addKanji).catch(addKanji);
    setTimeout(addKanji, 2500);
  } else { addKanji(); }

  /* ── Sakura petals (instanced) ── */
  const PETALS = isMobile ? 110 : 240;
  const petalGeo = new THREE.PlaneGeometry(0.09, 0.13);
  const petalMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false });
  const petals = new THREE.InstancedMesh(petalGeo, petalMat, PETALS);
  const dummy = new THREE.Object3D();
  const petalData = [];
  const petalColors = [new THREE.Color(0xf3c6d3), new THREE.Color(0xe8a4b8), new THREE.Color(0xf7e3ea), new THREE.Color(0xdf8fa5)];
  for (let i = 0; i < PETALS; i++) {
    petalData.push({
      x: (Math.random() - 0.5) * 16,
      y: (Math.random() - 0.5) * 12,
      z: (Math.random() - 0.5) * 8 - 1,
      speed: 0.25 + Math.random() * 0.55,
      swayAmp: 0.3 + Math.random() * 0.7,
      swayFreq: 0.4 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotSpeed: 0.5 + Math.random() * 1.5,
    });
    petals.setColorAt(i, petalColors[i % petalColors.length]);
  }
  petals.instanceColor.needsUpdate = true;
  scene.add(petals);

  /* ── Embers (warm rising points, additive) ── */
  function makeGlowTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.55)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  const EMBERS = isMobile ? 60 : 130;
  const emberGeo = new THREE.BufferGeometry();
  const emberPos = new Float32Array(EMBERS * 3);
  const emberCol = new Float32Array(EMBERS * 3);
  const emberData = [];
  const emberPalette = [new THREE.Color(0xffd60a), new THREE.Color(0xe23a2e), new THREE.Color(0xf2ede3), new THREE.Color(0xf59e0b)];
  for (let i = 0; i < EMBERS; i++) {
    emberPos[i * 3] = (Math.random() - 0.5) * 16;
    emberPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
    emberPos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
    const col = emberPalette[i % emberPalette.length];
    emberCol[i * 3] = col.r;
    emberCol[i * 3 + 1] = col.g;
    emberCol[i * 3 + 2] = col.b;
    emberData.push({
      speed: 0.12 + Math.random() * 0.3,
      swayAmp: 0.2 + Math.random() * 0.5,
      swayFreq: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
    });
  }
  emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
  emberGeo.setAttribute('color', new THREE.BufferAttribute(emberCol, 3));
  const emberMat = new THREE.PointsMaterial({
    size: 0.09, map: makeGlowTexture(), vertexColors: true, transparent: true,
    opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
  });
  const embers = new THREE.Points(emberGeo, emberMat);
  scene.add(embers);

  /* ── Orbit ring: proyek showcase (fades in near #proyek) ── */
  const orbitGroup = new THREE.Group();
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.012, 12, 128), ringMat);
  orbitGroup.add(ring);
  const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xe23a2e, transparent: true, opacity: 0 });
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.75, 0.006, 12, 128), ringMat2);
  ring2.rotation.x = 0.35;
  ring2.rotation.y = -0.3;
  orbitGroup.add(ring2);
  const satGeo = new THREE.IcosahedronGeometry(0.07, 0);
  const satellites = [];
  for (let i = 0; i < 6; i++) {
    const m = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? 0xd8dce2 : 0xe23a2e, metalness: 0.9, roughness: 0.25,
      transparent: true, opacity: 0,
    });
    const s = new THREE.Mesh(satGeo, m);
    satellites.push({ mesh: s, phase: (i / 6) * Math.PI * 2, speed: 0.12 + (i % 3) * 0.05, yOff: (i % 2 === 0 ? 0.35 : -0.35) * (i % 3 + 1) * 0.3 });
    orbitGroup.add(s);
  }
  orbitGroup.position.set(0, -0.4, -2);
  orbitGroup.rotation.x = 0.5;
  scene.add(orbitGroup);

  /* ── Camera journey waypoints (progress filled from real DOM offsets) ── */
  const WAYPOINT_DEFS = [
    { id: 'hero', cam: [0, 0, 8.0], katX: 2.4, katZ: -0.42, fog: 0x0b0b0d, rim: 0xe23a2e, ring: 0 },
    { id: 'tentang', cam: [-0.6, -0.35, 7.6], katX: -2.3, katZ: 0.38, fog: 0x0c0d10, rim: 0x4a6a8a, ring: 0 },
    { id: 'proyek', cam: [0.55, -0.75, 6.8], katX: 2.35, katZ: -0.42, fog: 0x0b0d12, rim: 0x38bdf8, ring: 1 },
    { id: 'pengalaman', cam: [-0.5, -1.15, 7.4], katX: -2.35, katZ: 0.38, fog: 0x0d0b0d, rim: 0xf59e0b, ring: 0.25 },
    { id: 'keahlian', cam: [0.45, -1.55, 7.0], katX: 2.3, katZ: -0.42, fog: 0x0b0d0f, rim: 0x19c3b2, ring: 0 },
    { id: 'penghargaan', cam: [-0.45, -1.9, 7.2], katX: -2.3, katZ: 0.38, fog: 0x100d08, rim: 0xffd60a, ring: 0 },
    { id: 'publikasi', cam: [0.35, -2.2, 7.3], katX: 2.35, katZ: -0.42, fog: 0x0c0b10, rim: 0x7c3aed, ring: 0 },
    { id: 'blog', cam: [-0.3, -2.4, 7.4], katX: -2.3, katZ: 0.38, fog: 0x0b0b10, rim: 0x38bdf8, ring: 0 },
    { id: 'kontak', cam: [0, -2.6, 6.4], katX: 0, katZ: 0, fog: 0x0b0b0d, rim: 0xe23a2e, ring: 0 },
  ];
  let waypoints = [];
  function computeWaypoints() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    waypoints = WAYPOINT_DEFS.map((d) => {
      const el = document.getElementById(d.id);
      const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
      return { ...d, p: max > 0 ? Math.min(Math.max(top / max, 0), 1) : 0 };
    }).sort((a, b) => a.p - b.p);
  }
  computeWaypoints();
  window.addEventListener('load', () => setTimeout(computeWaypoints, 600));
  setTimeout(computeWaypoints, 1500);

  const smooth = (t) => t * t * (3 - 2 * t);
  const lerp = (a, b, t) => a + (b - a) * t;
  const _ca = new THREE.Color();
  const _cb = new THREE.Color();
  function sampleJourney(p) {
    if (!waypoints.length) return { ...WAYPOINT_DEFS[0], p: 0, kanji: 1 };
    let a = waypoints[0];
    let b = waypoints[waypoints.length - 1];
    for (let i = 0; i < waypoints.length - 1; i++) {
      if (p >= waypoints[i].p && p <= waypoints[i + 1].p) { a = waypoints[i]; b = waypoints[i + 1]; break; }
    }
    const span = (b.p - a.p) || 1;
    const t = smooth(Math.min(Math.max((p - a.p) / span, 0), 1));
    const heroP = waypoints[0].p;
    const aboutP = waypoints.length > 1 ? waypoints[1].p : 1;
    const kanji = 1 - smooth(Math.min(Math.max((p - heroP) / Math.max(aboutP - heroP, 0.001), 0), 1));
    return {
      cam: [lerp(a.cam[0], b.cam[0], t), lerp(a.cam[1], b.cam[1], t), lerp(a.cam[2], b.cam[2], t)],
      katX: lerp(a.katX, b.katX, t),
      katZ: lerp(a.katZ, b.katZ, t),
      fog: _ca.setHex(a.fog).lerp(_cb.setHex(b.fog), t).clone(),
      rim: _ca.setHex(a.rim).lerp(_cb.setHex(b.rim), t).clone(),
      ring: lerp(a.ring, b.ring, t),
      kanji,
    };
  }

  /* ── Mouse parallax + scroll state + slash burst ── */
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  window.addEventListener('pointermove', (e) => {
    tmx = (e.clientX / window.innerWidth - 0.5) * 2;
    tmy = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  let scrollP = 0;
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollP = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
  }, { passive: true });

  // Slash burst on click/tap (fine pointer only, never on links/buttons)
  let slashEnergy = 0;
  if (finePointer && !reduced) {
    window.addEventListener('pointerdown', (e) => {
      if (e.target.closest('a, button')) return;
      slashEnergy = 1;
    }, { passive: true });
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    computeWaypoints();
  });

  /* ── Smoothed journey state ── */
  const cur = {
    cam: new THREE.Vector3(0, 0, 8),
    katX: 2.4, katZ: -0.42, ring: 0, kanji: 1,
    fog: new THREE.Color(0x0b0b0d), rim: new THREE.Color(0xe23a2e),
  };

  /* ── Animate ── */
  const clock = new THREE.Clock();
  let firstFrame = true;

  function animate() {
    requestAnimationFrame(animate);
    if (document.hidden) return; // don't burn GPU in background tabs
    const t = clock.getElapsedTime();

    mx += (tmx - mx) * 0.045;
    my += (tmy - my) * 0.045;
    slashEnergy *= 0.94;

    const j = sampleJourney(scrollP);
    // Ease the journey state toward its target (buttery, never snappy)
    cur.cam.x += (j.cam[0] - cur.cam.x) * 0.06;
    cur.cam.y += (j.cam[1] - cur.cam.y) * 0.06;
    cur.cam.z += (j.cam[2] - cur.cam.z) * 0.06;
    cur.katX += (j.katX - cur.katX) * 0.07;
    cur.katZ += (j.katZ - cur.katZ) * 0.07;
    cur.ring += (j.ring - cur.ring) * 0.05;
    cur.kanji += (j.kanji - cur.kanji) * 0.08;
    cur.fog.lerp(j.fog, 0.05);
    cur.rim.lerp(j.rim, 0.05);
    scene.fog.color.copy(cur.fog);
    rim.color.copy(cur.rim);
    rim.intensity = 60 + slashEnergy * 140;

    // Katana: journey position + float + slow spin + mouse follow + slash spin
    // Narrow screens: pull the katana toward center so it stays in frame
    const katXScale = window.innerWidth < 768 ? 0.45 : 1;
    katana.position.x = cur.katX * katXScale + Math.cos(t * 0.45) * 0.12 + mx * 0.18;
    katana.position.y = katanaHome.y + cur.cam.y * 0.55 + Math.sin(t * 0.7) * 0.22 + my * -0.12;
    katana.rotation.y = 0.5 + Math.sin(t * 0.25) * 0.35 + scrollP * Math.PI * 1.25 + mx * 0.3;
    katana.rotation.x = Math.sin(t * 0.4) * 0.08 + my * 0.18;
    katana.rotation.z = cur.katZ + slashEnergy * 0.9;

    // Petals drift (slash burst speeds them up)
    const speedMul = 1 + scrollP * 1.6 + slashEnergy * 2.5;
    for (let i = 0; i < PETALS; i++) {
      const p = petalData[i];
      p.y -= p.speed * speedMul * 0.016;
      p.phase += 0.016 * p.swayFreq;
      if (p.y < -6.5) { p.y = 6.5; p.x = (Math.random() - 0.5) * 16; }
      dummy.position.set(p.x + Math.sin(p.phase) * p.swayAmp, p.y, p.z);
      dummy.rotation.set(p.rotX + t * p.rotSpeed * 0.4, p.rotY + t * p.rotSpeed * 0.6, p.phase * 0.5);
      dummy.updateMatrix();
      petals.setMatrixAt(i, dummy.matrix);
    }
    petals.instanceMatrix.needsUpdate = true;

    // Embers rise
    const pos = emberGeo.attributes.position.array;
    for (let i = 0; i < EMBERS; i++) {
      const d = emberData[i];
      pos[i * 3 + 1] += d.speed * 0.016 * (1 + slashEnergy);
      d.phase += 0.016 * d.swayFreq;
      pos[i * 3] += Math.sin(d.phase) * 0.004;
      if (pos[i * 3 + 1] > 6.5) {
        pos[i * 3 + 1] = -6.5;
        pos[i * 3] = (Math.random() - 0.5) * 16;
      }
    }
    emberGeo.attributes.position.needsUpdate = true;
    emberMat.opacity = 0.45 + Math.sin(t * 0.8) * 0.12;

    // Orbit ring: rotate + fade with proyek proximity
    orbitGroup.rotation.z += 0.0016;
    orbitGroup.position.y = -0.4 + cur.cam.y * 0.55;
    ringMat.opacity = cur.ring * 0.5;
    ringMat2.opacity = cur.ring * 0.35;
    for (const s of satellites) {
      const a = s.phase + t * s.speed;
      s.mesh.position.set(Math.cos(a) * 2.4, Math.sin(a) * 0.5 + s.yOff, Math.sin(a) * 2.4 * 0.35);
      s.mesh.rotation.x += 0.01;
      s.mesh.rotation.y += 0.013;
      s.mesh.material.opacity = cur.ring * 0.9;
    }

    // Camera: journey + mouse parallax
    camera.position.set(cur.cam.x + mx * 0.5, cur.cam.y + my * -0.3, cur.cam.z);
    camera.lookAt(mx * 0.25, camera.position.y * 0.6, 0);

    if (kanjiSprite) {
      kanjiSprite.position.y = 0.6 + cur.cam.y * 0.55 + Math.sin(t * 0.3) * 0.3;
      kanjiSprite.material.rotation = Math.sin(t * 0.12) * 0.05;
      kanjiSprite.material.opacity = Math.max(cur.kanji, 0);
    }

    renderer.render(scene, camera);

    if (firstFrame) {
      firstFrame = false;
      window.dispatchEvent(new CustomEvent('scene-ready'));
    }
  }

  if (reduced) {
    // Static single frame for reduced motion (hero waypoint)
    const j = sampleJourney(0);
    camera.position.set(j.cam[0], j.cam[1], j.cam[2]);
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    window.dispatchEvent(new CustomEvent('scene-ready'));
  } else {
    animate();
  }
})();
