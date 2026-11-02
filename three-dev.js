/* ==========================================================================
   Developer-themed Three.js scene — dev network graph
   ========================================================================== */

(function () {
  "use strict";

  if (typeof THREE === "undefined") {
    console.warn("Three.js not loaded — 3D scene disabled.");
    return;
  }

  const container = document.getElementById("hero-canvas");
  if (!container) return;

  // Scene & camera
  const scene = new THREE.Scene();
  const aspect = container.clientWidth / container.clientHeight || 16 / 9;
  const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
  camera.position.set(0, 0, 7);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0x2563eb, 1);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x7c3aed, 0.5);
  fillLight.position.set(-3, -2, 4);
  scene.add(fillLight);

  // Object group
  const group = new THREE.Group();
  scene.add(group);

  // Central hub node
  const hubGeo = new THREE.IcosahedronGeometry(0.75, 1);
  const hubMat = new THREE.MeshStandardMaterial({
    color: 0x2563eb,
    metalness: 0.35,
    roughness: 0.3,
    emissive: 0x1e3a8a,
    emissiveIntensity: 0.25
  });
  const hub = new THREE.Mesh(hubGeo, hubMat);
  group.add(hub);

  // Satellite nodes orbiting the hub (developer network graph)
  const nodeCount = 10;
  const nodes = [];
  const ringRadius = 2.8;

  for (let i = 0; i < nodeCount; i++) {
    const isCube = i % 2 === 0;
    const geo = isCube
      ? new THREE.BoxGeometry(0.5, 0.5, 0.5)
      : new THREE.IcosahedronGeometry(0.35, 1);

    const hue = 0.55 + (i / nodeCount) * 0.2; // blue -> purple -> cyan
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(hue, 0.75, 0.55),
      metalness: 0.45,
      roughness: 0.35
    });

    const node = new THREE.Mesh(geo, mat);
    const angle = (i / nodeCount) * Math.PI * 2;
    const x = Math.cos(angle) * ringRadius;
    const z = Math.sin(angle) * ringRadius;
    const y = (Math.random() - 0.5) * 1.4;
    node.position.set(x, y, z);

    node.userData = {
      angle,
      radius: ringRadius,
      baseY: y,
      speed: 0.006 + Math.random() * 0.012,
      floatSpeed: 0.5 + Math.random() * 1,
      floatOffset: Math.random() * Math.PI * 2
    };

    group.add(node);
    nodes.push(node);

    // Connection line from hub to node (dependency / network edge)
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(x, y, z)
    ]);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x2563eb,
      transparent: true,
      opacity: 0.2
    });
    const line = new THREE.Line(lineGeo, lineMat);
    group.add(line);
  }

  // Background data particles
  const pCount = 140;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount * 3; i++) {
    pPos[i] = (Math.random() - 0.5) * 24;
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0x6366f1,
    size: 0.035,
    transparent: true,
    opacity: 0.5
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Mouse interaction
  const mouse = new THREE.Vector2(0, 0);
  window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX / window.innerWidth - 0.5;
    mouse.y = event.clientY / window.innerHeight - 0.5;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    // Slow group rotation with subtle mouse tilt
    group.rotation.y = t * 0.12 + mouse.x * 0.25;
    group.rotation.x = t * 0.06 + mouse.y * 0.15;

    // Central hub spin
    hub.rotation.y = t * 0.4;
    hub.rotation.x = t * 0.25;

    // Float & spin each satellite node
    nodes.forEach((node) => {
      node.rotation.y += node.userData.speed;
      node.rotation.x += node.userData.speed * 0.5;
      node.position.y =
        node.userData.baseY +
        Math.sin(t * node.userData.floatSpeed + node.userData.floatOffset) * 0.4;
    });

    particles.rotation.y = t * 0.04;
    particles.rotation.x = t * 0.02;

    renderer.render(scene, camera);
  }

  function onResize() {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener("resize", onResize);

  animate();
  onResize();
})();