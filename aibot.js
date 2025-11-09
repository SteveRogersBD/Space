import * as THREE from 'three';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

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

function createNewsCard(newsItem) {
  const card = document.createElement('div');
  card.className = 'news-card';
  
  const imageSection = document.createElement('div');
  imageSection.className = 'news-image';
  imageSection.style.backgroundImage = newsItem.urlToImage ? `url(${newsItem.urlToImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  
  // Add link icon overlay on image
  if (newsItem.url) {
    const linkOverlay = document.createElement('div');
    linkOverlay.className = 'news-link-overlay';
    linkOverlay.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 3h6v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    imageSection.appendChild(linkOverlay);
  }
  
  const contentSection = document.createElement('div');
  contentSection.className = 'news-content';
  
  const title = document.createElement('h4');
  title.textContent = newsItem.title;
  
  contentSection.appendChild(title);
  card.appendChild(imageSection);
  card.appendChild(contentSection);
  
  if (newsItem.url) {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Opening news:', newsItem.title, newsItem.url);
      window.open(newsItem.url, '_blank', 'noopener,noreferrer');
    });
  } else {
    card.style.opacity = '0.7';
    card.style.cursor = 'default';
  }
  
  return card;
}

function createPaperCard(paper) {
  const card = document.createElement('div');
  card.className = 'paper-card';
  
  // Add clickable indicator if URL exists
  if (paper.url) {
    card.style.cursor = 'pointer';
  } else {
    card.style.opacity = '0.7';
    card.style.cursor = 'default';
  }
  
  const icon = document.createElement('div');
  icon.className = 'paper-icon';
  icon.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 13H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 17H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10 9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  
  const content = document.createElement('div');
  content.className = 'paper-content';
  
  const title = document.createElement('h4');
  title.textContent = paper.title;
  
  const summary = document.createElement('p');
  summary.textContent = paper.abstract || paper.summary || 'No summary available';
  
  content.appendChild(title);
  content.appendChild(summary);
  card.appendChild(icon);
  card.appendChild(content);
  
  // Add click to open link icon if URL exists
  if (paper.url) {
    const linkIcon = document.createElement('div');
    linkIcon.className = 'paper-link-icon';
    linkIcon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 3h6v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    card.appendChild(linkIcon);
    
    card.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Opening paper:', paper.title, paper.url);
      window.open(paper.url, '_blank', 'noopener,noreferrer');
    });
  }
  
  return card;
}

function openImageLightbox(imageUrl) {
  // Create lightbox overlay
  const lightbox = document.createElement('div');
  lightbox.className = 'image-lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close">&times;</button>
      <img src="${imageUrl}" alt="Full size image" class="lightbox-image">
      <div class="lightbox-controls">
        <a href="${imageUrl}" target="_blank" class="lightbox-open-new">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15 3h6v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Open in New Tab
        </a>
      </div>
    </div>
  `;
  
  document.body.appendChild(lightbox);
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  
  // Close handlers
  const closeBtn = lightbox.querySelector('.lightbox-close');
  closeBtn.addEventListener('click', () => closeLightbox(lightbox));
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox(lightbox);
    }
  });
  
  // ESC key to close
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeLightbox(lightbox);
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
  
  // Animate in
  setTimeout(() => lightbox.classList.add('active'), 10);
}

function closeLightbox(lightbox) {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => lightbox.remove(), 300);
}

function createImageGallery(images) {
  const gallery = document.createElement('div');
  gallery.className = 'image-gallery';
  
  images.forEach(imageUrl => {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Search result';
    img.className = 'gallery-image';
    img.addEventListener('click', () => {
      openImageLightbox(imageUrl);
    });
    gallery.appendChild(img);
  });
  
  return gallery;
}

function updateThoughtBubble(content) {
  bubbleText.innerHTML = '';
  
  if (typeof content === 'string') {
    bubbleText.textContent = content;
  } else {
    // Content is an object with text and optional media
    const textDiv = document.createElement('div');
    textDiv.className = 'bubble-text';
    textDiv.textContent = content.text;
    bubbleText.appendChild(textDiv);
    
    if (content.media) {
      const mediaContainer = document.createElement('div');
      mediaContainer.className = 'bubble-media-container';
      
      if (content.media.images && content.media.images.length > 0) {
        const imagesSection = document.createElement('div');
        imagesSection.className = 'media-section';
        const gallery = createImageGallery(content.media.images);
        imagesSection.appendChild(gallery);
        mediaContainer.appendChild(imagesSection);
      }
      
      if (content.media.news && content.media.news.length > 0) {
        const newsSection = document.createElement('div');
        newsSection.className = 'media-section';
        const newsTitle = document.createElement('h3');
        newsTitle.textContent = 'Related News';
        newsTitle.className = 'section-title';
        newsSection.appendChild(newsTitle);
        
        const newsGrid = document.createElement('div');
        newsGrid.className = 'news-grid';
        content.media.news.forEach(newsItem => {
          newsGrid.appendChild(createNewsCard(newsItem));
        });
        newsSection.appendChild(newsGrid);
        mediaContainer.appendChild(newsSection);
      }
      
      if (content.media.papers && content.media.papers.length > 0) {
        const papersSection = document.createElement('div');
        papersSection.className = 'media-section';
        const papersTitle = document.createElement('h3');
        papersTitle.textContent = 'Research Papers';
        papersTitle.className = 'section-title';
        papersSection.appendChild(papersTitle);
        
        const papersGrid = document.createElement('div');
        papersGrid.className = 'papers-grid';
        content.media.papers.forEach(paper => {
          papersGrid.appendChild(createPaperCard(paper));
        });
        papersSection.appendChild(papersGrid);
        mediaContainer.appendChild(papersSection);
      }
      
      bubbleText.appendChild(mediaContainer);
    }
  }
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

async function fetchImages(keyword) {
  try {
    const response = await fetch(`http://localhost:8080/api/images?search=${encodeURIComponent(keyword)}`);
    if (!response.ok) throw new Error('Failed to fetch images');
    return await response.json();
  } catch (error) {
    console.error('Image API Error:', error);
    return [];
  }
}

async function fetchNews(keyword) {
  try {
    const response = await fetch(`http://localhost:8080/api/news?search=${encodeURIComponent(keyword)}`);
    if (!response.ok) throw new Error('Failed to fetch news');
    return await response.json();
  } catch (error) {
    console.error('News API Error:', error);
    return [];
  }
}

async function fetchPapers(keyword) {
  try {
    const response = await fetch(`http://localhost:8080/api/papers?search=${encodeURIComponent(keyword)}`);
    if (!response.ok) throw new Error('Failed to fetch papers');
    return await response.json();
  } catch (error) {
    console.error('Papers API Error:', error);
    return [];
  }
}

async function getBotResponse(userMessage) {
  try {
    const prompt = `You are a helpful assistant named Meteor. You know everything about Meteors, meteoroids, asteroids, comets, and space phenomena, and you will be teaching the user about these topics while answering their questions.

You have access to Google image API, scholar API, and news search API. When appropriate, provide search keywords for these resources to enhance your response.

IMPORTANT: You must respond with VALID JSON only. Follow this exact format:
{
  "text": "Your actual response here",
  "image": "image search keyword (optional, omit if not needed)",
  "news": "news search keyword (optional, omit if not needed)",
  "paper": "paper search keyword (optional, omit if not needed)"
}

Guidelines:
- Keep your text response conversational, engaging, and educational
- Only include image/news/paper keywords when they would genuinely enhance the answer
- Use specific, relevant keywords for searches
- Do not include fields if they're not needed for the question

User question: ${userMessage}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = responseText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').trim();
    }
    
    const parsedResponse = JSON.parse(jsonText);
    return parsedResponse;
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      text: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment!"
    };
  }
}

async function sendMessage() {
  const message = userInput.value.trim();
  
  if (message) {
    addUserMessage(message);
    userInput.value = '';
    
    // Show loading state
    updateThoughtBubble("Thinking...");
    
    // Get AI response
    const response = await getBotResponse(message);
    
    // Fetch additional media if keywords are provided
    const mediaContent = {
      text: response.text,
      media: {}
    };
    
    const fetchPromises = [];
    
    if (response.image) {
      fetchPromises.push(
        fetchImages(response.image).then(images => {
          if (images.length > 0) mediaContent.media.images = images;
        })
      );
    }
    
    if (response.news) {
      fetchPromises.push(
        fetchNews(response.news).then(news => {
          if (news.length > 0) mediaContent.media.news = news;
        })
      );
    }
    
    if (response.paper) {
      fetchPromises.push(
        fetchPapers(response.paper).then(papers => {
          if (papers.length > 0) mediaContent.media.papers = papers;
        })
      );
    }
    
    // Wait for all media to load
    await Promise.all(fetchPromises);
    
    // Update bubble with text and media
    updateThoughtBubble(mediaContent);
  }
}

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});
