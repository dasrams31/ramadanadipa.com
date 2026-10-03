/* ═══════════════════════════════════════════════════════════
   3D SCENE — Neo-Samurai: floating katana, sakura petals,
   giant kanji spirit, scroll-driven camera journey.
   ═══════════════════════════════════════════════════════════ */
import * as THREE from 'three';

(() => {
  const canvas = document.getElementById('scene3d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(pointer:coarse)').matches || window.innerWidth < 768;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
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
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
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

  /* ── Mouse parallax + scroll state ── */
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

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ── Animate ── */
  const clock = new THREE.Clock();
  let firstFrame = true;

  function animate() {
    requestAnimationFrame(animate);
    if (document.hidden) return; // don't burn GPU in background tabs
    const t = clock.getElapsedTime();

    mx += (tmx - mx) * 0.045;
    my += (tmy - my) * 0.045;

    // Katana: float + slow spin, scroll-driven rotation
    katana.position.y = katanaHome.y + Math.sin(t * 0.7) * 0.22;
    katana.position.x = katanaHome.x + Math.cos(t * 0.45) * 0.12;
    katana.rotation.y = 0.5 + Math.sin(t * 0.25) * 0.35 + scrollP * Math.PI * 1.25 + mx * 0.25;
    katana.rotation.x = Math.sin(t * 0.4) * 0.08 + my * 0.15;

    // Petals drift
    const speedMul = 1 + scrollP * 1.6;
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

    // Camera: subtle scroll dolly + mouse parallax
    camera.position.y = -scrollP * 2.6 + my * -0.3;
    camera.position.x = mx * 0.5;
    camera.lookAt(0, camera.position.y * 0.6, 0);

    if (kanjiSprite) {
      kanjiSprite.position.y = 0.6 + Math.sin(t * 0.3) * 0.3 - scrollP * 3;
      kanjiSprite.material.rotation = Math.sin(t * 0.12) * 0.05;
    }

    renderer.render(scene, camera);

    if (firstFrame) {
      firstFrame = false;
      window.dispatchEvent(new CustomEvent('scene-ready'));
    }
  }

  if (reduced) {
    // Static single frame for reduced motion
    renderer.render(scene, camera);
    window.dispatchEvent(new CustomEvent('scene-ready'));
  } else {
    animate();
  }
})();
