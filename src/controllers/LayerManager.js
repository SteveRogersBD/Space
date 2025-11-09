// LayerManager: tracks named data layers and their visibility, and exposes events
// to add/remove data. This is purposely lightweight and synchronous.

class LayerManagerClass {
  constructor() {
    this.layers = new Map(); // name -> {visible, data}
    this.listeners = new Set();
  }

  createLayer(name, opts = {}) {
    if (this.layers.has(name)) return this.layers.get(name);
    const layer = {
      name,
      visible: opts.visible ?? true,
      data: []
    };
    this.layers.set(name, layer);
    this.emit();
    return layer;
  }

  setVisible(name, visible) {
    const l = this.layers.get(name);
    if (!l) return;
    l.visible = !!visible;
    this.emit();
  }

  addData(name, items) {
    const l = this.layers.get(name) || this.createLayer(name, { visible: true });
    l.data.push(...items);
    this.emit();
  }

  clear(name) {
    const l = this.layers.get(name);
    if (!l) return;
    l.data = [];
    this.emit();
  }

  get(name) {
    return this.layers.get(name) || null;
  }

  onChange(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  emit() {
    for (const cb of this.listeners) {
      try { cb(this); } catch (e) { console.error('LayerManager listener', e); }
    }
  }
}

export const LayerManager = new LayerManagerClass();
