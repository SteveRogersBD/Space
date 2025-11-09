import * as THREE from 'three';

export class ParticleSystem {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.particles = [];
    this.group = new THREE.Group();
    this.clock = new THREE.Clock();
    this.texture = this.createCircularTexture();
    this.parent = options.attachTo || null;
    // If provided, attach marker group to an object (e.g. Earth) so markers stay fixed relative to it
    if (options.attachTo && options.attachTo.add) {
      options.attachTo.add(this.group);
      this.attached = true;
    } else {
      this.scene.add(this.group);
      this.attached = false;
    }

    // temp vectors to reduce allocations
    this._tmpWorld = new THREE.Vector3();
    this._earthWorld = new THREE.Vector3();
    this._normalWorld = new THREE.Vector3();
    this._camWorld = new THREE.Vector3();
  }

  createCircularTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Clear to transparent
    ctx.clearRect(0, 0, 256, 256);
    
    // Create a thin, solid circle
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 100);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.75, 'rgba(255,255,255,1)');    // Thinner solid core
    gradient.addColorStop(0.90, 'rgba(255,255,255,0.6)');  // Sharp edge
    gradient.addColorStop(1, 'rgba(255,255,255,0)');       // Clean cutoff
    
    // Fill entire canvas with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  spawnMeteor({ lat, lng, altitude = 0, magnitude = 1.0 }) {
    // Convert lat/lng to 3D position on unit sphere
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.cos(phi);
    const z = Math.sin(phi) * Math.sin(theta);

  // Anchor above the surface to avoid z-fighting and clipping with the globe
  const surfaceOffset = 0.035 + (altitude / 20000); // radius 1 -> 3.5% outward
  const start = new THREE.Vector3(x, y, z).multiplyScalar(1.0 + surfaceOffset);

    // Define distinct meteor types - smaller and thinner
    const meteorTypes = [
      { name: 'Fireball', color: 0xff3300, scale: 0.18 },
      { name: 'Bolide', color: 0xffaa00, scale: 0.18 },
      { name: 'Sporadic', color: 0x00ccff, scale: 0.18 },
      { name: 'Shower', color: 0xff00ff, scale: 0.18 },
      { name: 'Asteroid', color: 0x00ff66, scale: 0.18 },
    ];
    
    const type = meteorTypes[Math.floor(Math.random() * meteorTypes.length)];

    const material = new THREE.SpriteMaterial({
      map: this.texture,
      color: new THREE.Color(type.color),
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false
    });

    const sprite = new THREE.Sprite(material);
    sprite.position.copy(start);
    sprite.scale.setScalar(type.scale);

  // Longer life since they are static; can be adjusted or disabled
  const life = 20.0 + Math.min(30, magnitude * 5);
    const createdAt = this.clock.getElapsedTime();

    this.group.add(sprite);
    this.particles.push({ 
      sprite, 
  start,
  life,
      createdAt, 
      magnitude,
      type: type.name,
      baseScale: type.scale
    });
    return sprite;
  }

  update(camera) {
    const t = this.clock.getElapsedTime();
    const toRemove = [];
    const attachedTo = this.parent;
    if (attachedTo) {
      attachedTo.getWorldPosition(this._earthWorld);
    } else {
      this._earthWorld.set(0, 0, 0);
    }
    
    for (const p of this.particles) {
      const age = t - p.createdAt;
      const progress = Math.min(1, age / p.life);

      // Static position (no movement); ensure position remains exact
      p.sprite.position.copy(p.start);

      // Determine visibility: hide markers on the far (back) side of the globe.
      // Compute normal from Earth center to sprite and camera vector from Earth to camera.
      if (camera) {
        p.sprite.getWorldPosition(this._tmpWorld);
        this._normalWorld.copy(this._tmpWorld).sub(this._earthWorld).normalize();
        this._camWorld.copy(camera.position).sub(this._earthWorld).normalize();
        const facing = this._normalWorld.dot(this._camWorld);
        p.sprite.visible = facing > 0; // show only when on the front hemisphere
      } else {
        p.sprite.visible = true;
      }

      // Optional very slow fade near end of life (last 25%)
      const fadeStart = 0.75;
      if (progress < fadeStart) {
        p.sprite.material.opacity = 1.0;
      } else {
        const fadeProgress = (progress - fadeStart) / (1 - fadeStart);
        p.sprite.material.opacity = Math.max(0, 1 - fadeProgress);
      }

      // Constant size
      p.sprite.scale.setScalar(p.baseScale);
      
      if (age >= p.life) {
        toRemove.push(p);
      }
    }

    // Remove expired particles
    for (const r of toRemove) {
      this.group.remove(r.sprite);
      if (r.sprite.material) r.sprite.material.dispose();
      if (r.sprite.geometry) r.sprite.geometry.dispose();
      this.particles.splice(this.particles.indexOf(r), 1);
    }
  }

  dispose() {
    // Remove group from current parent (scene or attached object)
    if (this.group.parent) {
      this.group.parent.remove(this.group);
    }
    this.group.traverse((o) => {
      if (o.material) {
        if (Array.isArray(o.material)) o.material.forEach(m => m.dispose());
        else o.material.dispose();
      }
      if (o.geometry) o.geometry.dispose();
    });
  }
}
