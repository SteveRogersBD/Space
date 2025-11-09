# Design Document

## Overview

The Space Advisor landing page is a single-page web application featuring an immersive 3D space environment built with Three.js. The page centers around a photorealistic rotating Earth with atmospheric effects, orbital mechanics visualization, and a starfield background. Text content is overlaid using HTML/CSS while the 3D scene renders on a full-screen canvas.

## Architecture

### Technology Stack

- **Three.js** (r150+): Core 3D rendering library
- **HTML5**: Page structure and text overlay
- **CSS3**: Styling, positioning, and responsive layout
- **Vanilla JavaScript**: Scene initialization and animation loop
- **Vite**: Development server and build tool (already present in workspace)

### Application Structure

```
/
├── index.html          # Main HTML with canvas and text overlay
├── style.css           # Styling for layout and text
├── main.js             # Three.js scene setup and animation
├── textures/           # Earth and celestial body textures
│   ├── earth-day.jpg
│   ├── earth-night.jpg (optional)
│   └── moon.jpg
└── package.json        # Dependencies
```

## Components and Interfaces

### 1. Scene Manager

**Responsibility**: Initialize and manage the Three.js scene, camera, and renderer

**Key Elements**:
- `THREE.Scene`: Container for all 3D objects
- `THREE.PerspectiveCamera`: Camera with FOV 45-60°, positioned 3-5 units from Earth
- `THREE.WebGLRenderer`: WebGL renderer with alpha channel for transparent background

**Configuration**:
```javascript
camera.position.z = 4;
camera.fov = 50;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
```

### 2. Earth Component

**Responsibility**: Create and animate the Earth sphere with textures and atmosphere

**Implementation Details**:
- `THREE.SphereGeometry`: Radius 1, segments 64x64 for smooth appearance
- `THREE.MeshPhongMaterial`: Supports texture mapping and lighting
- Earth texture: High-resolution day texture (2048x1024 or higher)
- Rotation: 0.001-0.002 radians per frame on Y-axis

**Atmosphere Effect**:
- Outer sphere with slightly larger radius (1.1x Earth radius)
- `THREE.ShaderMaterial` with custom vertex/fragment shaders
- Fresnel effect for edge glow
- Blue-cyan color (#00d4ff with opacity gradient)

### 3. Orbital Rings Component

**Responsibility**: Render orbital paths around Earth with marker nodes

**Implementation Details**:
- `THREE.EllipseCurve` or `THREE.BufferGeometry` for ring paths
- Two rings at different inclinations (e.g., 0° and 60°)
- `THREE.LineBasicMaterial` with cyan color (#00d4ff)
- Marker nodes: Small `THREE.Mesh` spheres positioned along ring paths
- Optional: Subtle rotation animation for dynamic effect

### 4. Starfield Component

**Responsibility**: Generate background stars for depth and atmosphere

**Implementation Details**:
- `THREE.BufferGeometry` with 1000-2000 vertices
- Random positions in spherical distribution (radius 50-100 units)
- `THREE.PointsMaterial` with size 0.5-2.0
- White color with varying opacity for depth effect
- Static (no animation) for performance

### 5. Moon Component

**Responsibility**: Display Earth's moon in orbital position

**Implementation Details**:
- `THREE.SphereGeometry`: Radius 0.27 (relative to Earth)
- Position: 3-4 units from Earth center
- Moon texture applied via `THREE.MeshPhongMaterial`
- Optional: Orbital animation around Earth

### 6. Lighting System

**Responsibility**: Illuminate the scene realistically

**Implementation Details**:
- `THREE.DirectionalLight`: Main sun light from right side, intensity 1.5
- `THREE.AmbientLight`: Soft fill light, intensity 0.3
- Light positions simulate sun direction for realistic Earth shading

### 7. HTML Overlay

**Responsibility**: Display text content over the 3D scene

**Structure**:
```html
<div class="overlay">
  <h1 class="title">SPACE ADVISOR</h1>
  <p class="subtitle">AN INTERACTIVE EXPERIENCE OF THE DOCUMENTARY<br>
     BEYOND EARTH: THE BEGINNING OF NEWSPACE</p>
</div>
```

**Styling**:
- Absolute positioning, centered with flexbox
- White text with subtle text-shadow for readability
- Letter-spacing: 0.3-0.5em for title
- Font: Modern sans-serif (e.g., 'Montserrat', 'Rajdhani', or system fonts)
- Responsive font sizes using clamp() or media queries

### 8. Animation Loop

**Responsibility**: Update and render the scene continuously

**Implementation**:
```javascript
function animate() {
  requestAnimationFrame(animate);
  
  // Rotate Earth
  earth.rotation.y += 0.001;
  
  // Optional: Rotate orbital rings
  orbitalRings.rotation.y += 0.0005;
  
  // Render scene
  renderer.render(scene, camera);
}
```

### 9. Responsive Handler

**Responsibility**: Handle window resize events

**Implementation**:
```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

## Data Models

### Scene Configuration Object

```javascript
const sceneConfig = {
  earth: {
    radius: 1,
    segments: 64,
    rotationSpeed: 0.001,
    textureUrl: '/textures/earth-day.jpg'
  },
  atmosphere: {
    radius: 1.1,
    color: 0x00d4ff,
    opacity: 0.3
  },
  orbitalRings: [
    { radius: 1.5, inclination: 0, color: 0x00d4ff },
    { radius: 1.8, inclination: 60, color: 0x0088ff }
  ],
  moon: {
    radius: 0.27,
    distance: 3.5,
    textureUrl: '/textures/moon.jpg'
  },
  camera: {
    fov: 50,
    position: { x: 0, y: 0, z: 4 }
  },
  lights: {
    directional: { position: { x: 5, y: 3, z: 5 }, intensity: 1.5 },
    ambient: { intensity: 0.3 }
  }
};
```

## Error Handling

### Texture Loading Failures

- Use `THREE.TextureLoader` with error callbacks
- Provide fallback solid colors if textures fail to load
- Log errors to console for debugging

### WebGL Support Detection

- Check for WebGL support before initializing Three.js
- Display fallback message if WebGL is unavailable
- Graceful degradation for older browsers

### Performance Issues

- Monitor frame rate using `stats.js` (development only)
- Reduce geometry segments on lower-end devices
- Disable atmosphere shader on mobile if needed

## Testing Strategy

### Visual Testing

- Manual verification of Earth rotation smoothness
- Check atmosphere glow visibility and color accuracy
- Verify orbital rings render correctly at different angles
- Confirm text overlay readability against scene background

### Responsive Testing

- Test on viewport sizes: 320px, 768px, 1024px, 1920px, 3840px
- Verify canvas resizes correctly without distortion
- Check text scaling and positioning on mobile devices

### Performance Testing

- Measure FPS on target devices (desktop, tablet, mobile)
- Verify acceptable performance (30+ FPS) on mid-range hardware
- Test memory usage over extended viewing periods

### Cross-Browser Testing

- Test on Chrome, Firefox, Safari, Edge
- Verify WebGL compatibility
- Check for visual consistency across browsers

### Accessibility Considerations

- Ensure text has sufficient contrast ratio (4.5:1 minimum)
- Provide alt text or aria-labels where appropriate
- Consider reduced motion preferences for animations
