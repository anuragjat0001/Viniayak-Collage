/* ═══════════════════════════════════════════════════════════
   VINAYAK PG COLLEGE – THREE.JS 3D SCENE
   Campus Building + Floating Objects + Particles
   Compatible with Three.js r128
════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // ── Wait for THREE to be ready ──
  function initThreeScene() {
    if (typeof THREE === 'undefined') {
      setTimeout(initThreeScene, 50);
      return;
    }

    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // ── Scene ──
    const scene = new THREE.Scene();

    // ── Camera ──
    const camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      300
    );
    camera.position.set(0, 4, 18);
    camera.lookAt(0, 1, 0);

    // ── Color palette ──
    const C = {
      navy:    0x0a1428,
      navyMid: 0x0f1f3d,
      gold:    0xd4af77,
      goldBrt: 0xf5c469,
      emerald: 0x10b981,
      white:   0xffffff,
      winLit:  0xfff1a0,
      winDark: 0x4a6fa5,
    };

    // ──────────────────────────────────────
    // MATERIALS
    // ──────────────────────────────────────
    function mat(color, opts = {}) {
      return new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.1, ...opts });
    }
    function matGlass(color, opacity = 0.7) {
      return new THREE.MeshStandardMaterial({
        color,
        transparent: true,
        opacity,
        roughness: 0.1,
        metalness: 0.3,
      });
    }
    function matGold() {
      return new THREE.MeshStandardMaterial({
        color: C.gold,
        roughness: 0.3,
        metalness: 0.8,
        emissive: C.goldBrt,
        emissiveIntensity: 0.15
      });
    }
    function matEmissive(color, intensity = 0.5) {
      return new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: intensity,
        roughness: 0.4,
        metalness: 0.1
      });
    }

    // ──────────────────────────────────────
    // CAMPUS BUILDING GROUP
    // ──────────────────────────────────────
    const buildingGroup = new THREE.Group();
    scene.add(buildingGroup);

    // Helper: add box mesh
    function addBox(group, w, h, d, color, x = 0, y = 0, z = 0, opts = {}) {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, mat(color, opts));
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
    }

    // ── Ground plane ──
    const groundGeo = new THREE.PlaneGeometry(50, 50);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0d1f3c,
      roughness: 0.9,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // ── Lawn strips ──
    const lawnMat = new THREE.MeshStandardMaterial({ color: 0x074a2e, roughness: 0.9 });
    [-3.5, 3.5].forEach(x => {
      const lawn = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 8), lawnMat);
      lawn.rotation.x = -Math.PI / 2;
      lawn.position.set(x, 0.01, 2);
      scene.add(lawn);
    });

    // ── Main building body ──
    // Central block
    addBox(buildingGroup, 8, 4.5, 3, 0x152448, 0, 2.25, 0);
    // Left wing
    addBox(buildingGroup, 3.5, 3.5, 2.5, 0x122040, -5.75, 1.75, 0.25);
    // Right wing
    addBox(buildingGroup, 3.5, 3.5, 2.5, 0x122040,  5.75, 1.75, 0.25);

    // ── Parapet / Roofline ──
    addBox(buildingGroup, 8.6, 0.35, 3.4, 0x1a3568, 0, 4.68, 0);
    addBox(buildingGroup, 4,   0.3,  3,   0x192f60, -5.75, 3.51, 0.15);
    addBox(buildingGroup, 4,   0.3,  3,   0x192f60,  5.75, 3.51, 0.15);

    // ── Gold accent band on top ──
    const bandGeo = new THREE.BoxGeometry(8.7, 0.12, 3.45);
    const bandMesh = new THREE.Mesh(bandGeo, matGold());
    bandMesh.position.set(0, 4.85, 0);
    buildingGroup.add(bandMesh);

    // ── Columns (pillars) ──
    const colPositions = [-3.2, -1.6, 0, 1.6, 3.2];
    colPositions.forEach(x => {
      const col = addBox(buildingGroup, 0.22, 4.5, 0.22, 0x0d1e3e, x, 2.25, 1.35);
      col.castShadow = false;
    });

    // ── Windows (lit with emissive) ──
    function addWindow(group, x, y, z, color = C.winLit, width = 0.7, height = 0.55) {
      const wGeo = new THREE.PlaneGeometry(width, height);
      const wMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.9,
        side: THREE.FrontSide
      });
      const win = new THREE.Mesh(wGeo, wMat);
      win.position.set(x, y, z);
      group.add(win);
      return win;
    }

    // Row 1 windows – main block
    const row1Y = 3.4, row1Z = 1.52;
    [-2.8, -1.4, 0, 1.4, 2.8].forEach((x, i) => {
      const col = i % 2 === 0 ? 0xfff3a0 : 0xa0d8ff;
      addWindow(buildingGroup, x, row1Y, row1Z, col);
    });

    // Row 2 windows
    const row2Y = 2.2, row2Z = 1.52;
    [-2.8, -1.4, 0, 1.4, 2.8].forEach((x, i) => {
      const col = i % 3 === 0 ? 0x80f0c0 : 0xfff3a0;
      addWindow(buildingGroup, x, row2Y, row2Z, col);
    });

    // Row 1 – left wing
    [-5.3, -6.2].forEach(x => addWindow(buildingGroup, x, 2.9, 1.37, 0xfff3a0, 0.6, 0.5));
    [-5.3, -6.2].forEach(x => addWindow(buildingGroup, x, 1.8, 1.37, 0x80f0c0, 0.6, 0.5));
    // Row 1 – right wing
    [5.3,  6.2].forEach(x => addWindow(buildingGroup, x, 2.9, 1.37, 0xfff3a0, 0.6, 0.5));
    [5.3,  6.2].forEach(x => addWindow(buildingGroup, x, 1.8, 1.37, 0x80f0c0, 0.6, 0.5));

    // ── Main entrance door ──
    const doorFrame = addBox(buildingGroup, 1.1, 2, 0.1, 0xd4af77, 0, 1.0, 1.56);
    const door = addBox(buildingGroup, 0.95, 1.85, 0.08, 0x0a1428, 0, 0.98, 1.58);
    // Door arch
    const archGeo = new THREE.TorusGeometry(0.48, 0.06, 8, 16, Math.PI);
    const archMesh = new THREE.Mesh(archGeo, matGold());
    archMesh.position.set(0, 1.95, 1.57);
    buildingGroup.add(archMesh);

    // ── Flagpole ──
    const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, 3, 8);
    const pole = new THREE.Mesh(poleGeo, matGold());
    pole.position.set(0, 6.35, 0);
    buildingGroup.add(pole);
    // Flag (animated)
    const flagGeo = new THREE.PlaneGeometry(0.9, 0.55, 6, 4);
    const flagMat = new THREE.MeshStandardMaterial({
      color: C.goldBrt,
      side: THREE.DoubleSide,
      roughness: 0.8
    });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(0.48, 7.4, 0);
    buildingGroup.add(flag);

    // ── College name board ──
    const boardGeo = new THREE.BoxGeometry(4.5, 0.55, 0.08);
    const board = new THREE.Mesh(boardGeo, matGold());
    board.position.set(0, 4.55, 1.56);
    buildingGroup.add(board);

    // ── Trees ──
    function addTree(group, x, z) {
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.14, 1.5, 6),
        mat(0x2d1a0e)
      );
      trunk.position.set(x, 0.75, z);
      group.add(trunk);

      const foliage1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 8, 6),
        mat(0x064e3b)
      );
      foliage1.position.set(x, 2.1, z);
      group.add(foliage1);

      const foliage2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 8, 6),
        matEmissive(0x065f46, 0.1)
      );
      foliage2.position.set(x + 0.15, 2.65, z);
      group.add(foliage2);
    }

    addTree(scene, -9,  1);
    addTree(scene, -9, -1);
    addTree(scene,  9,  1);
    addTree(scene,  9, -1);
    addTree(scene, -10.5, 2);
    addTree(scene,  10.5, 2);

    buildingGroup.position.set(-2, 0, 0);

    // ──────────────────────────────────────
    // FLOATING OBJECTS
    // ──────────────────────────────────────
    const floatingObjects = [];

    function addFloating(mesh, basePos, speed = 0.8, amplitude = 0.3, rotSpeed = {x:0.3,y:0.5,z:0.1}) {
      mesh.position.set(basePos.x, basePos.y, basePos.z);
      mesh.castShadow = false;
      scene.add(mesh);
      floatingObjects.push({ mesh, basePos: {...basePos}, speed, amplitude, rotSpeed, phase: Math.random() * Math.PI * 2 });
    }

    // ── Graduation Cap ──
    function makeGradCap(scale = 1, color = C.goldBrt) {
      const g = new THREE.Group();
      const board = new THREE.Mesh(
        new THREE.BoxGeometry(0.65 * scale, 0.06 * scale, 0.65 * scale),
        mat(color)
      );
      const dome = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22 * scale, 0.25 * scale, 0.22 * scale, 8),
        mat(color)
      );
      dome.position.y = -0.1 * scale;
      g.add(board);
      g.add(dome);
      return g;
    }

    // ── Open Book ──
    function makeBook(scale = 1, color = 0xf5f0e8) {
      const g = new THREE.Group();
      const pageL = new THREE.Mesh(
        new THREE.BoxGeometry(0.38 * scale, 0.04 * scale, 0.52 * scale),
        mat(color)
      );
      pageL.position.x = -0.2 * scale;
      pageL.rotation.y = 0.2;

      const pageR = new THREE.Mesh(
        new THREE.BoxGeometry(0.38 * scale, 0.04 * scale, 0.52 * scale),
        mat(color)
      );
      pageR.position.x = 0.2 * scale;
      pageR.rotation.y = -0.2;

      const spine = new THREE.Mesh(
        new THREE.BoxGeometry(0.06 * scale, 0.06 * scale, 0.52 * scale),
        mat(0xc8a040)
      );
      g.add(pageL, pageR, spine);
      return g;
    }

    // ── Beaker / Flask ──
    function makeBeaker(scale = 1, liquidColor = 0x10b981) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16 * scale, 0.12 * scale, 0.45 * scale, 12),
        matGlass(0x9ee5f8, 0.4)
      );
      const liquid = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13 * scale, 0.1 * scale, 0.2 * scale, 12),
        matEmissive(liquidColor, 0.6)
      );
      liquid.position.y = -0.12 * scale;
      const neck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07 * scale, 0.14 * scale, 0.15 * scale, 8),
        matGlass(0x9ee5f8, 0.4)
      );
      neck.position.y = 0.28 * scale;
      g.add(body, liquid, neck);
      return g;
    }

    // ── Geometric Orb ──
    function makeOrb(scale = 1, color = C.gold) {
      const g = new THREE.Group();
      const inner = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.22 * scale, 0),
        matEmissive(color, 0.4)
      );
      const outer = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.3 * scale, 1),
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.1,
          metalness: 0.9,
          wireframe: true,
          transparent: true,
          opacity: 0.3
        })
      );
      g.add(inner, outer);
      return g;
    }

    // ── Basketball ──
    function makeBasketball(scale = 1) {
      const g = new THREE.Group();
      const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.24 * scale, 16, 12),
        mat(0xe05c1a)
      );
      // Lines
      const lineMat = new THREE.LineBasicMaterial({ color: 0x1a0600 });
      const ring1 = new THREE.Mesh(
        new THREE.TorusGeometry(0.24 * scale, 0.008 * scale, 4, 32),
        mat(0x1a0600)
      );
      const ring2 = ring1.clone();
      ring2.rotation.y = Math.PI / 2;
      g.add(ball, ring1, ring2);
      return g;
    }

    // Place floating objects
    const capR = makeGradCap(0.7, C.goldBrt);
    addFloating(capR, {x:5, y:5, z:-2}, 0.7, 0.35, {x:0.1, y:0.6, z:0.05});

    const capL = makeGradCap(0.5, C.gold);
    addFloating(capL, {x:-6, y:6, z:-3}, 1.0, 0.4, {x:0.2, y:0.4, z:0.1});

    const bookR = makeBook(0.9);
    addFloating(bookR, {x:6.5, y:3, z:-1.5}, 0.9, 0.3, {x:0.4, y:0.3, z:0.2});

    const bookL = makeBook(0.7);
    addFloating(bookL, {x:-7, y:4, z:-1}, 0.6, 0.4, {x:0.2, y:0.5, z:0.15});

    const beakerR = makeBeaker(0.9, C.emerald);
    addFloating(beakerR, {x:7, y:6.5, z:-2}, 1.1, 0.3, {x:0.3, y:0.7, z:0.2});

    const beakerL = makeBeaker(0.6, 0x6ee7b7);
    addFloating(beakerL, {x:-5, y:7, z:-2.5}, 0.8, 0.45, {x:0.1, y:0.6, z:0.15});

    const orbA = makeOrb(1.1, C.gold);
    addFloating(orbA, {x:4, y:8, z:-4}, 1.2, 0.5, {x:0.8, y:1.0, z:0.3});

    const orbB = makeOrb(0.7, C.emerald);
    addFloating(orbB, {x:-8, y:5.5, z:-3}, 0.9, 0.35, {x:0.5, y:0.8, z:0.2});

    const ball = makeBasketball(0.85);
    addFloating(ball, {x:-4.5, y:3.5, z:-1}, 1.3, 0.25, {x:0.6, y:0.8, z:0.3});

    // ──────────────────────────────────────
    // PARTICLE SYSTEM (stars / dust)
    // ──────────────────────────────────────
    const PARTICLE_COUNT = 400;
    const pPositions = new Float32Array(PARTICLE_COUNT * 3);
    const pColors    = new Float32Array(PARTICLE_COUNT * 3);
    const pSizes     = new Float32Array(PARTICLE_COUNT);

    const goldC   = new THREE.Color(C.gold);
    const emeraldC = new THREE.Color(C.emerald);
    const whiteC  = new THREE.Color(0xffffff);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pPositions[i * 3]     = (Math.random() - 0.5) * 50;
      pPositions[i * 3 + 1] = Math.random() * 20;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;

      const colorChoice = Math.random();
      const c = colorChoice < 0.5 ? goldC : colorChoice < 0.8 ? whiteC : emeraldC;
      pColors[i * 3]     = c.r;
      pColors[i * 3 + 1] = c.g;
      pColors[i * 3 + 2] = c.b;
      pSizes[i] = Math.random() * 2.5 + 0.5;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pColors,    3));
    pGeo.setAttribute('size',     new THREE.BufferAttribute(pSizes,     1));

    const pMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ──────────────────────────────────────
    // LIGHTING
    // ──────────────────────────────────────
    // Ambient
    const ambient = new THREE.AmbientLight(0x0a1428, 0.8);
    scene.add(ambient);

    // Main directional (moonlight)
    const dirLight = new THREE.DirectionalLight(0xb8d4ff, 1.2);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(1024, 1024);
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 60;
    dirLight.shadow.camera.left   = -20;
    dirLight.shadow.camera.right  =  20;
    dirLight.shadow.camera.top    =  20;
    dirLight.shadow.camera.bottom = -5;
    scene.add(dirLight);

    // Gold accent light (entrance)
    const goldLight = new THREE.PointLight(0xf5c469, 1.8, 15);
    goldLight.position.set(0, 3, 5);
    scene.add(goldLight);

    // Emerald fill light
    const greenLight = new THREE.PointLight(0x10b981, 0.6, 20);
    greenLight.position.set(-8, 6, 3);
    scene.add(greenLight);

    // Blue back light
    const blueLight = new THREE.PointLight(0x1a4499, 0.8, 25);
    blueLight.position.set(0, 15, -8);
    scene.add(blueLight);

    // Window glow lights
    const winLightL = new THREE.PointLight(0xfff3a0, 0.4, 6);
    winLightL.position.set(-3, 3, 2.5);
    scene.add(winLightL);

    const winLightR = new THREE.PointLight(0xfff3a0, 0.4, 6);
    winLightR.position.set(3, 3, 2.5);
    scene.add(winLightR);

    // ──────────────────────────────────────
    // MOUSE / TOUCH INTERACTION
    // ──────────────────────────────────────
    let isDragging = false;
    let prevMouseX = 0, prevMouseY = 0;
    let cameraTheta = 0;  // horizontal angle
    let cameraPhi   = 0.22; // vertical angle
    let targetTheta = 0;
    let targetPhi   = 0.22;
    const CAM_RADIUS = 18;
    const CAM_Y_BASE = 4;

    // Mouse subtle parallax (non-drag)
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    function onPointerDown(e) {
      isDragging = true;
      prevMouseX = e.touches ? e.touches[0].clientX : e.clientX;
      prevMouseY = e.touches ? e.touches[0].clientY : e.clientY;
    }

    function onPointerMove(e) {
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const dx = (cx - prevMouseX) * 0.005;
        const dy = (cy - prevMouseY) * 0.003;
        targetTheta -= dx;
        targetPhi    = Math.max(-0.1, Math.min(0.7, targetPhi - dy));
        prevMouseX = cx;
        prevMouseY = cy;
      } else {
        // Subtle parallax
        const rect = canvas.getBoundingClientRect();
        targetMouseX = ((cx - rect.left) / rect.width  - 0.5) * 2;
        targetMouseY = ((cy - rect.top)  / rect.height - 0.5) * 2;
      }
    }

    function onPointerUp() { isDragging = false; }

    canvas.addEventListener('mousedown',  onPointerDown, { passive: true });
    canvas.addEventListener('mousemove',  onPointerMove, { passive: true });
    canvas.addEventListener('mouseup',    onPointerUp);
    canvas.addEventListener('touchstart', onPointerDown, { passive: true });
    canvas.addEventListener('touchmove',  onPointerMove, { passive: true });
    canvas.addEventListener('touchend',   onPointerUp);

    // ──────────────────────────────────────
    // FLAG WAVE ANIMATION
    // ──────────────────────────────────────
    const flagPositions = flag.geometry.attributes.position;
    const flagInitial   = new Float32Array(flagPositions.array);

    // ──────────────────────────────────────
    // RESIZE HANDLER
    // ──────────────────────────────────────
    function onResize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onResize);

    // ──────────────────────────────────────
    // ANIMATION LOOP
    // ──────────────────────────────────────
    let clock = 0;

    function animate() {
      requestAnimationFrame(animate);
      clock += 0.016;

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Smooth camera orbit
      cameraTheta += (targetTheta - cameraTheta) * 0.04;
      cameraPhi   += (targetPhi   - cameraPhi)   * 0.04;

      // Auto slow rotation (when not dragging)
      if (!isDragging) {
        targetTheta += 0.001;
      }

      // Camera position
      const camX  = Math.sin(cameraTheta) * CAM_RADIUS;
      const camZ  = Math.cos(cameraTheta) * CAM_RADIUS;
      const camY  = CAM_Y_BASE + Math.sin(cameraPhi) * CAM_RADIUS * 0.5;
      camera.position.lerp(
        new THREE.Vector3(camX + mouseX * 1.5, camY - mouseY * 1.0, camZ),
        0.05
      );
      camera.lookAt(0, 2, 0);

      // Floating objects animation
      floatingObjects.forEach(obj => {
        const t = clock * obj.speed + obj.phase;
        obj.mesh.position.y = obj.basePos.y + Math.sin(t) * obj.amplitude;
        obj.mesh.position.x = obj.basePos.x + Math.cos(t * 0.6) * (obj.amplitude * 0.3);
        obj.mesh.rotation.x += obj.rotSpeed.x * 0.016;
        obj.mesh.rotation.y += obj.rotSpeed.y * 0.016;
        obj.mesh.rotation.z += obj.rotSpeed.z * 0.016;
      });

      // Subtle building group float
      buildingGroup.position.y = Math.sin(clock * 0.3) * 0.05;

      // Flag wave
      const fPos = flag.geometry.attributes.position;
      for (let i = 0; i < fPos.count; i++) {
        const x = flagInitial[i * 3];
        const waveFactor = (x / 0.9) + 0.1;
        fPos.setZ(i, Math.sin(clock * 3 + x * 8) * 0.04 * waveFactor);
      }
      fPos.needsUpdate = true;

      // Gold light pulse
      goldLight.intensity = 1.5 + Math.sin(clock * 1.5) * 0.3;

      // Particle slow drift
      particles.rotation.y += 0.0004;
      particles.rotation.x  = Math.sin(clock * 0.05) * 0.02;

      renderer.render(scene, camera);
    }

    animate();

    // Expose for external pause/resume
    window._threeScene = { renderer, scene, camera };
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeScene);
  } else {
    initThreeScene();
  }
})();
