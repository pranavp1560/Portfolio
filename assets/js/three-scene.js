// Immersive Full-Screen 3D WebGL Scroll-Linked Camera Flight Controller

document.addEventListener("DOMContentLoaded", () => {
  initHUD3DUniverse();
});

// Helper: Programmatic glowing circle texture
function createHUDGlowTexture(colorStr = '#06b6d4', size = 64) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, colorStr);
  gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.25)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  return new THREE.CanvasTexture(canvas);
}

function initHUD3DUniverse() {
  const container = document.createElement('div');
  container.id = 'hud-universe-canvas-container';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.zIndex = '-1';
  container.style.pointerEvents = 'none';
  container.style.overflow = 'hidden';
  document.body.appendChild(container);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x04050e, 0.045);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 6, 16);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambient);

  const cyanLight = new THREE.PointLight(0x06b6d4, 1.5, 30);
  cyanLight.position.set(0, 2, 0);
  scene.add(cyanLight);

  const emeraldLight = new THREE.PointLight(0x10b981, 1.2, 30);
  emeraldLight.position.set(4, 1, -4);
  scene.add(emeraldLight);

  /* =========================================================================
     3D SCENE OBJECTS (Distributed in space along the scroll flight-path)
     ========================================================================= */

  // 1. Blueprint Grid Floor (Holographic plane)
  const gridHelper = new THREE.GridHelper(60, 60, 0x06b6d4, 0x011e30);
  gridHelper.position.y = -2;
  gridHelper.material.opacity = 0.45;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // 2. Central Neural Data Core (Hero focus)
  const coreGroup = new THREE.Group();
  coreGroup.position.set(0, 0.5, 0);
  scene.add(coreGroup);

  const coreGeom = new THREE.IcosahedronGeometry(1.6, 2);
  const coreWireframeMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    wireframe: true,
    transparent: true,
    opacity: 0.3
  });
  const coreMesh = new THREE.Mesh(coreGeom, coreWireframeMat);
  coreGroup.add(coreMesh);

  // Core internal glowing sphere
  const innerGeom = new THREE.SphereGeometry(0.8, 16, 16);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.55
  });
  const innerSphere = new THREE.Mesh(innerGeom, innerMat);
  coreGroup.add(innerSphere);

  // Core orbit rings
  const ringGeom = new THREE.RingGeometry(2.2, 2.25, 64);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
  const ring1 = new THREE.Mesh(ringGeom, ringMat);
  ring1.rotation.x = Math.PI / 2;
  coreGroup.add(ring1);

  const ring2 = new THREE.Mesh(ringGeom, ringMat);
  ring2.rotation.y = Math.PI / 4;
  coreGroup.add(ring2);

  // 3. Database Server Cluster (Experience focus - Left space)
  const dbCluster = new THREE.Group();
  dbCluster.position.set(-6, 0.5, -8);
  scene.add(dbCluster);

  const dbMat = new THREE.MeshPhongMaterial({ color: 0x0a1128, specular: 0x06b6d4, transparent: true, opacity: 0.9 });
  const diskMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  
  for (let i = 0; i < 3; i++) {
    const serverGeom = new THREE.CylinderGeometry(1.0, 1.0, 0.6, 16);
    const server = new THREE.Mesh(serverGeom, dbMat);
    server.position.y = i * 0.9;
    dbCluster.add(server);

    const bandGeom = new THREE.CylinderGeometry(1.02, 1.02, 0.08, 16);
    const band = new THREE.Mesh(bandGeom, diskMat);
    band.position.y = i * 0.9;
    dbCluster.add(band);
  }

  // 4. Bar Chart Valley (Projects focus - Right space)
  const chartValley = new THREE.Group();
  chartValley.position.set(7, -0.5, -4);
  scene.add(chartValley);

  const barMat = new THREE.MeshPhongMaterial({ color: 0x051b2c, specular: 0x06b6d4, transparent: true, opacity: 0.8 });
  const barLineMat = new THREE.LineBasicMaterial({ color: 0x00f2fe, opacity: 0.5, transparent: true });

  const bars = [];
  const barHeights = [1.5, 2.8, 2.0, 3.4];
  for (let i = 0; i < 4; i++) {
    const h = barHeights[i];
    const geom = new THREE.BoxGeometry(0.5, h, 0.5);
    const bar = new THREE.Mesh(geom, barMat);
    bar.position.set(i * 1.0 - 1.5, h / 2 - 1.5, 0);
    chartValley.add(bar);
    bars.push(bar);

    const edges = new THREE.EdgesGeometry(geom);
    const wireframe = new THREE.LineSegments(edges, barLineMat);
    wireframe.position.copy(bar.position);
    chartValley.add(wireframe);
  }

  // 5. Floating Starfield / Scatter Data points
  const particleCount = 250;
  const scatterGeom = new THREE.BufferGeometry();
  const scatterPositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    scatterPositions[i] = (Math.random() - 0.5) * 50;
    scatterPositions[i + 1] = (Math.random() - 0.5) * 20 + 2;
    scatterPositions[i + 2] = (Math.random() - 0.5) * 40 - 5;
  }
  scatterGeom.setAttribute('position', new THREE.BufferAttribute(scatterPositions, 3));

  const scatterMat = new THREE.PointsMaterial({
    size: 0.45,
    map: createHUDGlowTexture('#06b6d4', 32),
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const scatterPoints = new THREE.Points(scatterGeom, scatterMat);
  scene.add(scatterPoints);

  /* =========================================================================
     CAMERA FLIGHT-PATH WAYPOINTS (Scroll mapped positions)
     ========================================================================= */
  const waypoints = [
    { pos: new THREE.Vector3(0, 4, 13), look: new THREE.Vector3(0, 0.5, 0) },      // Section 0: Hero
    { pos: new THREE.Vector3(-3, 2, 7), look: new THREE.Vector3(0, 0.5, -2) },     // Section 1: About
    { pos: new THREE.Vector3(5, 1.5, 3), look: new THREE.Vector3(7, -0.5, -4) },   // Section 2: Projects
    { pos: new THREE.Vector3(-4, 2, -3), look: new THREE.Vector3(-6, 1.5, -8) },   // Section 3: Experience
    { pos: new THREE.Vector3(0, 6, 8), look: new THREE.Vector3(0, 1.5, -10) },     // Section 4: Skills
    { pos: new THREE.Vector3(0, 3, 14), look: new THREE.Vector3(0, 0.5, 0) }       // Section 5: Contact
  ];

  // Camera targets to smoothly LERP towards
  const targetCamPos = new THREE.Vector3().copy(waypoints[0].pos);
  const targetCamLook = new THREE.Vector3().copy(waypoints[0].look);
  const currentCamLook = new THREE.Vector3().copy(waypoints[0].look);

  // Mouse tilt offsets
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.002;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.002;
  });

  // Calculate position along scroll segments
  function updateScrollWaypoints() {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollableHeight <= 0) return;

    const scrollRatio = Math.max(0, Math.min(1, window.scrollY / scrollableHeight));
    
    // Determine segment
    const segmentCount = waypoints.length - 1;
    const rawIndex = scrollRatio * segmentCount;
    const index = Math.floor(rawIndex);
    const fraction = rawIndex - index;

    if (index >= segmentCount) {
      targetCamPos.copy(waypoints[segmentCount].pos);
      targetCamLook.copy(waypoints[segmentCount].look);
    } else {
      const pStart = waypoints[index].pos;
      const pEnd = waypoints[index + 1].pos;
      targetCamPos.lerpVectors(pStart, pEnd, fraction);

      const lStart = waypoints[index].look;
      const lEnd = waypoints[index + 1].look;
      targetCamLook.lerpVectors(lStart, lEnd, fraction);
    }
  }

  window.addEventListener('scroll', updateScrollWaypoints);
  updateScrollWaypoints(); // initial trigger

  // Animation render loop
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.015;

    // 1. Mesh Idle Animations
    coreMesh.rotation.y += 0.002;
    coreMesh.rotation.x += 0.001;
    ring1.rotation.z += 0.004;
    ring2.rotation.z -= 0.003;
    dbCluster.rotation.y += 0.004;

    for (let i = 0; i < bars.length; i++) {
      bars[i].scale.y = 1.0 + Math.sin(time * 2 + i) * 0.15;
    }

    // Floating drift on scatter points
    scatterPoints.rotation.y += 0.0003;
    scatterPoints.rotation.x += 0.0001;

    // 2. Camera smooth interpolation (Damped Lerp)
    // Blend scroll target + minor mouse tilt
    const actualTargetPos = new THREE.Vector3().copy(targetCamPos);
    actualTargetPos.x += mouseX * 2;
    actualTargetPos.y -= mouseY * 2;

    camera.position.lerp(actualTargetPos, 0.06);

    currentCamLook.lerp(targetCamLook, 0.06);
    camera.lookAt(currentCamLook);

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
