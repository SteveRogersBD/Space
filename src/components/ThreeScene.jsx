import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ParticleSystem } from '../controllers/ParticleSystem';
import { LayerManager } from '../controllers/LayerManager';
import { APIService } from '../controllers/APIService';
import { CacheManager } from '../controllers/CacheManager';
import { SearchController } from '../controllers/SearchController';
import { GlobeController } from '../controllers/GlobeController';
import { throttle } from '../utils/performance';
import { StateManager } from '../store/StateManager';

export default function ThreeScene() {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Ensure the canvas accepts mouse interactions (CSS uses #canvas.interactive)
    try {
      canvasRef.current.classList.add('interactive');
      // Fallback in case CSS class isn't applied
      canvasRef.current.style.pointerEvents = 'auto';
    } catch (_) { /* noop */ }

    // Check for WebGL support
    function checkWebGLSupport() {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
      } catch (e) {
        return false;
      }
    }

    if (!checkWebGLSupport()) {
      const errorMessage = document.createElement('div');
      errorMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 2rem;
        border-radius: 8px;
        text-align: center;
        font-family: sans-serif;
        max-width: 500px;
        z-index: 1000;
      `;
      errorMessage.innerHTML = `
        <h2 style="margin-top: 0;">WebGL Not Supported</h2>
        <p>Your browser does not support WebGL, which is required for this 3D experience.</p>
        <p>Please try using a modern browser like Chrome, Firefox, Safari, or Edge.</p>
      `;
      document.body.appendChild(errorMessage);
      return;
    }

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 4;

  // Initialize renderer with quality settings
    const quality = StateManager.getState().ui.particleDensity || 'high';
    const antialiasEnabled = quality !== 'low';
    const pixelRatio = quality === 'low' ? 1 : Math.min(window.devicePixelRatio, 2);
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: antialiasEnabled
    });
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create starfield with LOD based on quality
    const starGeometry = new THREE.BufferGeometry();
    const starCountByQuality = { low: 800, medium: 1500, high: 2000 };
    const starCount = starCountByQuality[quality] || 2000;
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = 50 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i3 + 2] = radius * Math.cos(phi);
      
      const sizeRandom = Math.random();
      if (sizeRandom > 0.95) {
        starSizes[i] = 2.5 + Math.random() * 1.5;
      } else if (sizeRandom > 0.8) {
        starSizes[i] = 1.2 + Math.random() * 1.0;
      } else {
        starSizes[i] = 0.5 + Math.random() * 0.5;
      }
      
      const colorRandom = Math.random();
      if (colorRandom > 0.9) {
        starColors[i3] = 1.0;
        starColors[i3 + 1] = 0.8 + Math.random() * 0.2;
        starColors[i3 + 2] = 0.6 + Math.random() * 0.2;
      } else if (colorRandom > 0.7) {
        starColors[i3] = 0.8 + Math.random() * 0.2;
        starColors[i3 + 1] = 0.9 + Math.random() * 0.1;
        starColors[i3 + 2] = 1.0;
      } else {
        starColors[i3] = 1.0;
        starColors[i3 + 1] = 1.0;
        starColors[i3 + 2] = 1.0;
      }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vSize;
        
        void main() {
          vColor = color;
          vSize = size;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vColor;
        varying float vSize;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) {
            discard;
          }
          
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha = pow(alpha, 1.5);
          
          float twinkle = sin(time * 2.0 + gl_FragCoord.x * 0.1 + gl_FragCoord.y * 0.1) * 0.15 + 0.85;
          
          float core = 1.0 - smoothstep(0.0, 0.2, dist);
          float brightness = mix(1.0, 1.5, core * (vSize / 4.0));
          
          gl_FragColor = vec4(vColor * brightness * twinkle, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const starfield = new THREE.Points(starGeometry, starMaterial);
    scene.add(starfield);

    // Create Earth
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const earthMaterial = new THREE.MeshStandardMaterial({
      color: 0x2233ff,
      roughness: 0.9,
      metalness: 0.1
    });

    textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
      (texture) => {
        earthMaterial.map = texture;
        earthMaterial.color.setHex(0xffffff);
        earthMaterial.needsUpdate = true;
      }
    );

    textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
      (texture) => {
        earthMaterial.normalMap = texture;
        earthMaterial.normalScale.set(0.85, 0.85);
        earthMaterial.needsUpdate = true;
      }
    );

    textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg',
      (texture) => {
        earthMaterial.roughnessMap = texture;
        earthMaterial.roughness = 0.7;
        earthMaterial.needsUpdate = true;
      }
    );

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Lighting - main directional light from sun
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Camera light - follows camera to illuminate dark side when searching
    const cameraLight = new THREE.PointLight(0xffffff, 1.5, 100);
    camera.add(cameraLight);
    scene.add(camera);

    const ambientLight = new THREE.AmbientLight(0x404060, 0.3); // Increased from 0.15
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0x0d1b2a, 0x000000, 0.3);
    scene.add(hemisphereLight);

    // Create concentric rings
    const concentricRings = [];
    const ringColors = [
      { color: 0x00d4ff },
      { color: 0x0099cc },
      { color: 0x0066aa }
    ];

    ringColors.forEach((config, index) => {
      const segments = 128;
      const ringGeometry = new THREE.BufferGeometry();
      const ringPositions = new Float32Array((segments + 1) * 3);
      
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        ringPositions[i * 3] = Math.cos(angle);
        ringPositions[i * 3 + 1] = 0;
        ringPositions[i * 3 + 2] = Math.sin(angle);
      }
      
      ringGeometry.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
      
      const ringMaterial = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(config.color) },
          time: { value: 0 },
          ringIndex: { value: index },
          opacity: { value: 1.0 },
          scale: { value: 1.0 }
        },
        vertexShader: `
          uniform float scale;
          void main() {
            vec3 pos = position * scale;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          uniform float opacity;
          
          void main() {
            vec3 glowColor = color * 2.5;
            gl_FragColor = vec4(glowColor, opacity);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        linewidth: 3
      });
      
      const ring = new THREE.Line(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      
      scene.add(ring);
      concentricRings.push({
        mesh: ring,
        material: ringMaterial,
        startDelay: index * 0.8
      });
    });

    // Create moon
    const moonGeometry = new THREE.SphereGeometry(0.27, 64, 64);
    const moonMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 1.0,
      metalness: 0.0
    });

    textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg',
      (texture) => {
        moonMaterial.map = texture;
        moonMaterial.color.setHex(0xffffff);
        moonMaterial.needsUpdate = true;
      }
    );

    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moon);

    // Animation variables
    let moonOrbitAngle = 0;
    const moonOrbitRadius = 3.5;
    const moonOrbitSpeed = 0.008;
    const ringAnimationSpeed = 0.015;
    const ringMaxScale = 3.5;
    const ringStartScale = 1.2;

    // Animation loop (we'll use rafWrapper below)

    // Init controls via GlobeController
    const globe = new GlobeController(camera, renderer.domElement);

    // Expose focus helper for UI
    window.focusOnLatLng = (lat, lng, distance = 3, duration = 1200) => globe.focus(lat, lng, distance, duration);
    
    // Expose meteor spawn helper for UI
    window.spawnMeteorAtLocation = (lat, lng, magnitude = 2.0) => {
      particleSystem.spawnMeteor({ lat, lng, magnitude });
  };
  // Initialize particle system anchored to Earth so markers move with the globe
  const particleSystem = new ParticleSystem(scene, { attachTo: earth });

    // fetch & spawn function
    let fetchTimer = null;
    async function fetchAndSpawn() {
      try {
        // Try cache first
        const cached = CacheManager.get('ams:fireballs');
        let data = cached;
        if (!data) {
          try {
            data = await APIService.fetchAMSFireballs();
            CacheManager.set('ams:fireballs', data, 60);
          } catch (apiErr) {
            console.warn('API fetch failed, using mock data', apiErr);
            // Use mock data if API fails
            data = generateMockMeteors();
          }
        }

        // Basic normalization: look for lat/lon in common properties
        const items = Array.isArray(data) ? data : (data.items || data.fireballs || []);

        // spawn a few recent items
        let spawned = 0;
        for (let i = 0; i < Math.min(items.length, 8); i++) {
          const it = items[i];
          const lat = it.lat || it.latitude || (it.geometry && it.geometry.coordinates && it.geometry.coordinates[1]);
          const lng = it.lng || it.longitude || (it.geometry && it.geometry.coordinates && it.geometry.coordinates[0]);
          const mag = it.mag || it.magnitude || 1.0;
          if (typeof lat === 'number' && typeof lng === 'number') {
            particleSystem.spawnMeteor({ lat, lng, magnitude: mag });
            spawned++;
          }
        }
        console.log(`[ThreeScene] Spawned ${spawned} meteors`);
      } catch (err) {
        // non-blocking: log and continue
        console.warn('fetchAndSpawn error', err);
      }
    }

    // Generate mock meteor data for demo
    function generateMockMeteors() {
      const mockData = [];
      for (let i = 0; i < 12; i++) {
        mockData.push({
          lat: (Math.random() - 0.5) * 160, // -80 to 80
          lng: (Math.random() - 0.5) * 360, // -180 to 180
          magnitude: 1 + Math.random() * 3
        });
      }
      return mockData;
    }

    // Spawn initial demo meteors immediately
    const demoMeteors = [
      { lat: 40.7, lng: -74.0, magnitude: 2.5 }, // New York
      { lat: 51.5, lng: -0.1, magnitude: 2.0 }, // London
      { lat: 35.7, lng: 139.7, magnitude: 3.0 }, // Tokyo
      { lat: -33.9, lng: 18.4, magnitude: 1.8 }, // Cape Town
      { lat: -23.5, lng: -46.6, magnitude: 2.2 }, // São Paulo
      { lat: 55.8, lng: 37.6, magnitude: 1.5 }, // Moscow
    ];
    
    console.log('[ThreeScene] Spawning demo meteors...');
    demoMeteors.forEach(m => particleSystem.spawnMeteor(m));

    // Start the fetch loop
    fetchAndSpawn();
    fetchTimer = setInterval(fetchAndSpawn, 30 * 1000);

    // Continuous spawning for visual demo (spawn a random meteor every 3-5 seconds)
    let continuousTimer = null;
    function spawnRandomMeteor() {
      const lat = (Math.random() - 0.5) * 140; // -70 to 70
      const lng = (Math.random() - 0.5) * 360; // -180 to 180
      const magnitude = 1 + Math.random() * 2.5;
      particleSystem.spawnMeteor({ lat, lng, magnitude });
      
      // Schedule next spawn
      const delay = 3000 + Math.random() * 2000; // 3-5 seconds
      continuousTimer = setTimeout(spawnRandomMeteor, delay);
    }
    
    // Start continuous spawning after initial delay
    setTimeout(spawnRandomMeteor, 2000);

    // State for rotation control
    let isRotating = true;
    
    // call particle update in main loop
    // single RAF wrapper that updates scene, controls and particles
    const rafWrapper = () => {
      animationFrameRef.current = requestAnimationFrame(rafWrapper);
      starMaterial.uniforms.time.value += 0.01;
      concentricRings.forEach((ring) => {
        ring.material.uniforms.time.value += ringAnimationSpeed;
        const progress = (ring.material.uniforms.time.value - ring.startDelay) % 4.0;
        if (progress > 0) {
          const normalizedProgress = progress / 4.0;
          const scale = ringStartScale + (ringMaxScale - ringStartScale) * normalizedProgress;
          ring.material.uniforms.scale.value = scale;
          const opacity = Math.max(0, 1.0 - normalizedProgress);
          ring.material.uniforms.opacity.value = opacity * 0.8;
        } else {
          ring.material.uniforms.opacity.value = 0;
        }
      });
      
      // Auto-rotate only when enabled
      if (isRotating) {
        earth.rotation.y += 0.003;
      }
      
      moonOrbitAngle += moonOrbitSpeed;
      moon.position.x = Math.cos(moonOrbitAngle) * moonOrbitRadius;
      moon.position.z = Math.sin(moonOrbitAngle) * moonOrbitRadius;
  // update particle system with camera (for front-side visibility)
  particleSystem.update(camera);
      // update controls
      try { globe.update(); } catch (e) { /* ignore */ }
      renderer.render(scene, camera);
    };

    // Expose globe rotation control globally
    window.stopGlobeRotation = () => { isRotating = false; };
    window.startGlobeRotation = () => { isRotating = true; };

  // stop previous animate and start wrapper instead
  if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  rafWrapper();

    // Handle resize with throttling for performance
    const handleResize = throttle(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 150);

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      renderer.dispose();
      // clear timers
      if (fetchTimer) clearInterval(fetchTimer);
      if (continuousTimer) clearTimeout(continuousTimer);
      try { particleSystem.dispose(); } catch (e) { /* ignore */ }
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  return <canvas id="canvas" ref={canvasRef} />;
}

