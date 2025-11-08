import * as THREE from 'three';

// Create THREE.Scene instance
const scene = new THREE.Scene();

// Set up THREE.PerspectiveCamera
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 4;

// Initialize THREE.WebGLRenderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('canvas'),
  alpha: true,
  antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Create starfield background
const starGeometry = new THREE.BufferGeometry();
const starCount = 1500;
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

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  starMaterial.uniforms.time.value += 0.01;
  starfield.rotation.y += 0.0002;
  
  renderer.render(scene, camera);
}

animate();

// Window resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Chat functionality
const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

function addMessage(content, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.textContent = content;
  
  messageDiv.appendChild(contentDiv);
  chatContainer.appendChild(messageDiv);
  
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function getBotResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm here to help you explore the wonders of space. What would you like to know?";
  } else if (lowerMessage.includes('earth')) {
    return "Earth is our home planet, the third from the Sun. It's the only known planet to harbor life and has a unique atmosphere that protects us from harmful radiation.";
  } else if (lowerMessage.includes('moon')) {
    return "The Moon is Earth's only natural satellite. It orbits our planet at an average distance of 384,400 km and influences our tides through its gravitational pull.";
  } else if (lowerMessage.includes('space') || lowerMessage.includes('universe')) {
    return "Space is vast and mysterious! The observable universe is about 93 billion light-years in diameter and contains billions of galaxies, each with billions of stars.";
  } else if (lowerMessage.includes('star')) {
    return "Stars are massive, luminous spheres of plasma held together by gravity. Our Sun is a medium-sized star that provides the energy necessary for life on Earth.";
  } else if (lowerMessage.includes('planet')) {
    return "There are 8 planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each has unique characteristics and mysteries to explore!";
  } else if (lowerMessage.includes('help')) {
    return "I can answer questions about space, planets, stars, the moon, and the universe. Just ask me anything you're curious about!";
  } else {
    return "That's an interesting question! While I'm still learning, I'd love to help you explore more about space. Try asking about planets, stars, or the universe!";
  }
}

function sendMessage() {
  const message = userInput.value.trim();
  
  if (message) {
    addMessage(message, true);
    userInput.value = '';
    
    setTimeout(() => {
      const response = getBotResponse(message);
      addMessage(response, false);
    }, 500);
  }
}

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
