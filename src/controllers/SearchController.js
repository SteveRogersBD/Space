import { APIService } from './APIService';
import { CacheManager } from './CacheManager';

export const SearchController = {
  async search(query) {
    const cacheKey = `geocode:${query}`;
    const cached = CacheManager.get(cacheKey);
    if (cached) return cached;

    try {
      const res = await APIService.geocode(query);
      if (res) {
        const out = {
          formatted: res.formatted,
          geometry: res.geometry
        };
        CacheManager.set(cacheKey, out, 60 * 60);
        return out;
      }
      return null;
    } catch (err) {
      console.error('SearchController.search error', err);
      throw err;
    }
  }
};
