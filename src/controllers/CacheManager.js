// Simple CacheManager using localStorage with TTL support.
const PREFIX = 'live-meteor-cache:';

export const CacheManager = {
  set(key, value, ttlSeconds = 60 * 5) {
    try {
      const record = {
        value,
        expiresAt: Date.now() + ttlSeconds * 1000
      };
      localStorage.setItem(PREFIX + key, JSON.stringify(record));
    } catch (err) {
      console.warn('CacheManager.set failed', err);
    }
  },

  get(key) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (!raw) return null;
      const record = JSON.parse(raw);
      if (record.expiresAt && Date.now() > record.expiresAt) {
        localStorage.removeItem(PREFIX + key);
        return null;
      }
      return record.value;
    } catch (err) {
      console.warn('CacheManager.get failed', err);
      return null;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch (err) {
      console.warn('CacheManager.remove failed', err);
    }
  }
};
