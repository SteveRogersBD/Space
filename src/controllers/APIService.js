// Lightweight API service for fetching NASA, AMS, GMN and geocoding data.
// Note: Add your API keys in .env.local and follow README to set them up.

const DEFAULT_TIMEOUT = 10000;

function timeoutFetch(url, opts = {}, timeout = DEFAULT_TIMEOUT) {
  return Promise.race([
    fetch(url, opts),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
  ]);
}

export const APIService = {
  async fetchNASAFeed() {
    // NASA NEO feed (example: feed for today)
    try {
      const today = new Date().toISOString().slice(0, 10);
      const key = process.env.VITE_NASA_API_KEY || '';
      const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${key}`;
      const res = await timeoutFetch(url);
      if (!res.ok) throw new Error(`NASA API ${res.status}`);
      return res.json();
    } catch (err) {
      console.error('fetchNASAFeed error', err);
      throw err;
    }
  },

  async fetchAMSFireballs() {
    // AMS fireball feed - replace with concrete endpoint if available
    try {
      const url = `https://fireballs.amsmeteors.org/json/`; // example endpoint
      const res = await timeoutFetch(url);
      if (!res.ok) throw new Error(`AMS API ${res.status}`);
      return res.json();
    } catch (err) {
      console.error('fetchAMSFireballs error', err);
      throw err;
    }
  },

  async fetchGMNCameras() {
    try {
      const url = 'https://globalmeteornetwork.org/observations.json';
      const res = await timeoutFetch(url);
      if (!res.ok) throw new Error(`GMN API ${res.status}`);
      return res.json();
    } catch (err) {
      console.error('fetchGMNCameras error', err);
      throw err;
    }
  },

  async geocode(query) {
    // OpenCage geocoding
    try {
      const key = import.meta.env.VITE_OPENCAGE_KEY || '';
      if (!key) {
        console.error('VITE_OPENCAGE_KEY is not set');
        throw new Error('Geocoding API key not configured');
      }
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${key}&limit=1`;
      const res = await timeoutFetch(url);
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Geocode API ${res.status}:`, errorText);
        throw new Error(`Geocode API ${res.status}`);
      }
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return data.results[0];
      }
      throw new Error('No results found');
    } catch (err) {
      console.error('geocode error', err);
      throw err;
    }
  }
};
