import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

export class GlobeController {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.controls = new OrbitControls(camera, domElement);
    
    // Explicitly enable all controls
    this.controls.enabled = true;
    this.controls.enableRotate = true;
    this.controls.enableZoom = true;
    this.controls.enablePan = true;
    
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.rotateSpeed = 0.4;
    this.controls.zoomSpeed = 0.8;
    this.controls.minDistance = 1.5;
    this.controls.maxDistance = 20;
    this.tween = null;
    this.isInteracting = false;
    this.interactionTimeout = null;
    
    // Override wheel event handling to allow page scrolling
    this.setupScrollHandling();
  }
  
  setupScrollHandling() {
    // Track mouse interactions
    this.controls.domElement.addEventListener('mousedown', () => {
      this.isInteracting = true;
      this.clearInteractionTimeout();
    });
    
    this.controls.domElement.addEventListener('mouseup', () => {
      this.setInteractionTimeout();
    });
    
    this.controls.domElement.addEventListener('mousemove', (event) => {
      if (event.buttons > 0) {
        this.isInteracting = true;
        this.clearInteractionTimeout();
      }
    });
  }
  
  setInteractionTimeout() {
    this.clearInteractionTimeout();
    this.interactionTimeout = setTimeout(() => {
      this.isInteracting = false;
    }, 1000); // Stop capturing wheel events 1 second after interaction ends
  }
  
  clearInteractionTimeout() {
    if (this.interactionTimeout) {
      clearTimeout(this.interactionTimeout);
      this.interactionTimeout = null;
    }
  }

  update() {
    this.controls.update();
  }

  latLngToVector3(lat, lng, radius = 1) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.cos(phi);
    const z = Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x * radius, y * radius, z * radius);
  }

  focus(lat, lng, distance = 3, duration = 1200) {
    if (this.tween) { cancelAnimationFrame(this.tween); this.tween = null; }
    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();
    const endTarget = this.latLngToVector3(lat, lng, 1.0);
    // compute camera end position: offset along normal
    const endPos = endTarget.clone().multiplyScalar(distance);

    const startTime = performance.now();
    const animate = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // smooth ease
      this.camera.position.lerpVectors(startPos, endPos, ease);
      this.controls.target.lerpVectors(startTarget, endTarget, ease);
      this.controls.update();
      if (t < 1) this.tween = requestAnimationFrame(animate); else this.tween = null;
    };
    this.tween = requestAnimationFrame(animate);
  }

  dispose() {
    this.clearInteractionTimeout();
    try { this.controls.dispose(); } catch (e) { /* ignore */ }
  }
}
