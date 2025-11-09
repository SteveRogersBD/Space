import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GlobeController } from '../controllers/GlobeController';

export default function BasicThreeScene() {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const animationFrameRef = useRef(null);
  const globeRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

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

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create starfield
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
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

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Lighting
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404060, 0.15);
    scene.add(ambientLight);

    // Create moon
    const moonGeometry = new THREE.SphereGeometry(0.27, 64, 64);
    const moonMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 1.0,
      metalness: 0.0
    });

    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moon);

    // Init controls
    const globe = new GlobeController(camera, renderer.domElement);
    globeRef.current = globe;
    
    // Enable canvas interaction only when hovering
    const enableInteraction = () => {
      canvasRef.current.classList.add('interactive');
    };
    
    const disableInteraction = () => {
      if (!globe.isInteracting) {
        canvasRef.current.classList.remove('interactive');
      }
    };
    
    canvasRef.current.addEventListener('mouseenter', enableInteraction);
    canvasRef.current.addEventListener('mouseleave', disableInteraction);

    let moonOrbitAngle = 0;
    const moonOrbitRadius = 3.5;
    const moonOrbitSpeed = 0.008;

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      starMaterial.uniforms.time.value += 0.01;
      earth.rotation.y += 0.003;
      
      moonOrbitAngle += moonOrbitSpeed;
      moon.position.x = Math.cos(moonOrbitAngle) * moonOrbitRadius;
      moon.position.z = Math.sin(moonOrbitAngle) * moonOrbitRadius;
      
      globe.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mouseenter', enableInteraction);
        canvasRef.current.removeEventListener('mouseleave', disableInteraction);
      }
      if (globeRef.current) {
        globeRef.current.dispose();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      renderer.dispose();
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
