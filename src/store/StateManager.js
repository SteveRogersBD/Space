// Small central state manager without external deps.
// Exposes getState, setState, subscribe.

const initialState = {
  layers: {},
  ui: {
    darkMode: true,
    ambientMode: true,
    particleDensity: 'high'
  }
};

class StateManagerClass {
  constructor() {
    this.state = { ...initialState };
    this.listeners = new Set();
  }

  getState() {
    return this.state;
  }

  setState(patch) {
    this.state = { ...this.state, ...patch };
    for (const cb of this.listeners) cb(this.state);
  }

  subscribe(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }
}

export const StateManager = new StateManagerClass();
