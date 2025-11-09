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
const bubbleText = document.getElementById('bubbleText');
const userMessagesStack = document.getElementById('userMessagesStack');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

function updateThoughtBubble(content) {
  bubbleText.textContent = content;
}

function addUserMessage(content) {
  // Clear previous messages - only show latest
  userMessagesStack.innerHTML = '';
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'user-message-bubble';
  
  const textP = document.createElement('p');
  textP.textContent = content;
  
  messageDiv.appendChild(textP);
  userMessagesStack.appendChild(messageDiv);
}

function getBotResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm Meteor, your guide to the fascinating world of meteors and space rocks. What would you like to know?";
  } else if (lowerMessage.includes('meteor')) {
    return "Meteors are space rocks that burn up in Earth's atmosphere, creating bright streaks of light we call 'shooting stars'. Most are smaller than a grain of sand!";
  } else if (lowerMessage.includes('meteorite')) {
    return "A meteorite is a meteor that survives its journey through the atmosphere and lands on Earth's surface. They're incredibly valuable for scientific research!";
  } else if (lowerMessage.includes('asteroid')) {
    return "Asteroids are rocky objects orbiting the Sun, mostly found in the asteroid belt between Mars and Jupiter. When they enter Earth's atmosphere, they become meteors!";
  } else if (lowerMessage.includes('comet')) {
    return "Comets are icy bodies that release gas and dust, forming beautiful tails when they approach the Sun. They're like cosmic snowballs!";
  } else if (lowerMessage.includes('shower')) {
    return "Meteor showers occur when Earth passes through debris left by comets. Famous ones include the Perseids in August and Geminids in December!";
  } else if (lowerMessage.includes('help') || lowerMessage.includes('what')) {
    return "I can tell you about meteors, meteorites, asteroids, comets, meteor showers, and how they impact Earth. What interests you most?";
  } else {
    return "That's an interesting question about space! I specialize in meteors and related phenomena. Try asking me about meteors, asteroids, or meteor showers!";
  }
}

function sendMessage() {
  const message = userInput.value.trim();
  
  if (message) {
    addUserMessage(message);
    userInput.value = '';
    
    setTimeout(() => {
      const response = getBotResponse(message);
      updateThoughtBubble(response);
    }, 500);
  }
}

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});
