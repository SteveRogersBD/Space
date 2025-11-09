import { APIService } from '../controllers/APIService';
import { CacheManager } from '../controllers/CacheManager';

// Mock fetch
global.fetch = jest.fn();

describe('APIService', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  test('fetchNASAFeed returns data on success', async () => {
    const mockData = { near_earth_objects: {} };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const result = await APIService.fetchNASAFeed();
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('fetchNASAFeed throws on error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    await expect(APIService.fetchNASAFeed()).rejects.toThrow();
  });

  test('fetchAMSFireballs returns data', async () => {
    const mockData = { fireballs: [] };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const result = await APIService.fetchAMSFireballs();
    expect(result).toEqual(mockData);
  });

  test('geocode returns location data', async () => {
    const mockData = { results: [{ geometry: { lat: 40.7, lng: -74.0 }, formatted: 'New York' }] };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const result = await APIService.geocode('New York');
    expect(result).toBeTruthy();
    expect(result.geometry).toBeDefined();
  });
});

describe('CacheManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('set and get values', () => {
    CacheManager.set('test', { foo: 'bar' }, 60);
    const result = CacheManager.get('test');
    expect(result).toEqual({ foo: 'bar' });
  });

  test('returns null for expired values', () => {
    CacheManager.set('test', { foo: 'bar' }, -1);
    const result = CacheManager.get('test');
    expect(result).toBeNull();
  });

  test('remove clears value', () => {
    CacheManager.set('test', { foo: 'bar' }, 60);
    CacheManager.remove('test');
    const result = CacheManager.get('test');
    expect(result).toBeNull();
  });
});
