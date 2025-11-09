// Keyboard shortcuts manager for accessibility

class KeyboardManager {
  constructor() {
    this.handlers = new Map();
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  register(key, handler, description = '') {
    this.handlers.set(key.toLowerCase(), { handler, description });
  }

  unregister(key) {
    this.handlers.delete(key.toLowerCase());
  }

  handleKeyDown(e) {
    const key = e.key.toLowerCase();
    const entry = this.handlers.get(key);
    if (entry) {
      e.preventDefault();
      entry.handler(e);
    }
  }

  getShortcuts() {
    const shortcuts = [];
    this.handlers.forEach((value, key) => {
      shortcuts.push({ key, description: value.description });
    });
    return shortcuts;
  }
}

export const keyboardManager = new KeyboardManager();

// Register default shortcuts
if (typeof window !== 'undefined') {
  keyboardManager.register('h', () => {
    const heroEl = document.querySelector('.hero');
    if (heroEl) heroEl.scrollIntoView({ behavior: 'smooth' });
  }, 'Scroll to hero');

  keyboardManager.register('g', () => {
    const globeEl = document.getElementById('globe-root');
    if (globeEl) globeEl.scrollIntoView({ behavior: 'smooth' });
  }, 'Scroll to globe');

  keyboardManager.register('?', () => {
    const shortcuts = keyboardManager.getShortcuts();
    console.log('Keyboard shortcuts:', shortcuts);
    alert('Keyboard Shortcuts:\n' + shortcuts.map(s => `${s.key.toUpperCase()}: ${s.description}`).join('\n'));
  }, 'Show shortcuts help');
}
