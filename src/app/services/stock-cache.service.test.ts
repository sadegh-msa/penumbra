import { beforeEach, describe, expect, it, vi } from 'bun:test';
import StockCacheService from './stock-cache.service';

describe('StockCacheService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should build a namespaced storage key from the provided name', () => {
      const service = new StockCacheService('pixabay');
      expect(service).toBeInstanceOf(StockCacheService);
    });
  });

  describe('update', () => {
    it('should serialize and store cache data with the current date', () => {
      const service = new StockCacheService('PIXABAY');
      const response = { hits: [] };
      service.update('nature', response);
      const stored = localStorage.getItem('pen_stock_cache_PIXABAY');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.query).toBe('nature');
      expect(parsed.response).toEqual(response);
      expect(parsed.state).toEqual({});
      expect(new Date(parsed.date).getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('load', () => {
    it('should return cached response when query matches and cache is fresh', () => {
      const service = new StockCacheService('PIXABAY');
      service.update('nature', { hits: ['photo'] });
      const result = service.load('nature');
      expect(result).toEqual({ hits: ['photo'] });
    });

    it('should return null when query does not match', () => {
      const service = new StockCacheService('PIXABAY');
      service.update('nature', { hits: [] });
      const result = service.load('city');
      expect(result).toBeNull();
    });

    it('should return null when cached data has no response', () => {
      const service = new StockCacheService('PIXABAY');
      localStorage.setItem(
        'pen_stock_cache_PIXABAY',
        JSON.stringify({ query: 'nature', response: null, date: new Date() })
      );
      const result = service.load('nature');
      expect(result).toBeNull();
    });

    it('should return null when cache has expired beyond 30 minutes', () => {
      const service = new StockCacheService('PIXABAY');
      const expiredDate = new Date(Date.now() - 31 * 60 * 1000);
      localStorage.setItem(
        'pen_stock_cache_PIXABAY',
        JSON.stringify({ query: 'nature', response: { hits: [] }, date: expiredDate })
      );
      const result = service.load('nature');
      expect(result).toBeNull();
    });

    it('should return cached response when cache is within 30 minutes', () => {
      const service = new StockCacheService('PIXABAY');
      const recentDate = new Date(Date.now() - 10 * 60 * 1000);
      localStorage.setItem(
        'pen_stock_cache_PIXABAY',
        JSON.stringify({ query: 'nature', response: { hits: [] }, date: recentDate })
      );
      const result = service.load('nature');
      expect(result).toEqual({ hits: [] });
    });

    it('should return null when no cached data exists', () => {
      const service = new StockCacheService('PIXABAY');
      const result = service.load('nature');
      expect(result).toBeNull();
    });
  });

  describe('clear', () => {
    it('should remove cached data from localStorage', () => {
      const service = new StockCacheService('PIXABAY');
      service.update('nature', { hits: [] });
      service.clear();
      expect(localStorage.getItem('pen_stock_cache_PIXABAY')).toBeNull();
    });
  });
});
