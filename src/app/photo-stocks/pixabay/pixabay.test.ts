import { afterEach, beforeEach, describe, expect, it, vi } from 'bun:test';
import PixabayStock from './pixabay';

describe('PixabayStock', () => {
  const originalInnerWidth = globalThis.window?.innerWidth;
  const originalInnerHeight = globalThis.window?.innerHeight;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    Object.defineProperty(globalThis.window || globalThis, 'innerWidth', { value: 1920, configurable: true });
    Object.defineProperty(globalThis.window || globalThis, 'innerHeight', { value: 1080, configurable: true });
    localStorage.setItem('pen_stock_key_PIXABAY', 'stored-key');
  });

  afterEach(() => {
    if (originalInnerWidth !== undefined) {
      Object.defineProperty(globalThis.window || globalThis, 'innerWidth', {
        value: originalInnerWidth,
        configurable: true
      });
    }
    if (originalInnerHeight !== undefined) {
      Object.defineProperty(globalThis.window || globalThis, 'innerHeight', {
        value: originalInnerHeight,
        configurable: true
      });
    }
  });

  describe('info', () => {
    it('should expose frozen stock info', () => {
      const stock = new PixabayStock();
      expect(stock.info).toEqual({
        name: 'PIXABAY',
        label: 'Pixabay.com',
        url: 'https://pixabay.com/api'
      });
      expect(Object.isFrozen(stock.info)).toBe(true);
    });
  });

  describe('setParam and getParam', () => {
    it('should map friendly param names to native param names', () => {
      const stock = new PixabayStock();
      stock.setParam('query', 'nature');
      expect(stock.getParam('query')).toBe('nature');
    });

    it('should pass through unknown param names unchanged', () => {
      const stock = new PixabayStock();
      stock.setParam('custom', 'value');
      expect(stock.getParam('custom')).toBe('value');
    });

    it('should map heigh to min_height', () => {
      const stock = new PixabayStock();
      stock.setParam('heigh', 500);
      expect(stock.getParam('min_height')).toBe(500);
    });

    it('should map editorsChoice to editors_choice', () => {
      const stock = new PixabayStock();
      stock.setParam('editorsChoice', true);
      expect(stock.getParam('editors_choice')).toBe(true);
    });

    it('should map perPage to per_page', () => {
      const stock = new PixabayStock();
      stock.setParam('perPage', 10);
      expect(stock.getParam('per_page')).toBe(10);
    });

    it('should expose page as a getter/setter pair', () => {
      const stock = new PixabayStock();
      stock.page = 3;
      expect(stock.page).toBe(3);
    });

    it('should expose query as a getter/setter pair', () => {
      const stock = new PixabayStock();
      stock.query = 'mountains';
      expect(stock.query).toBe('mountains');
    });
  });

  describe('clearCache', () => {
    it('should delegate to the stock cache service', () => {
      const stock = new PixabayStock();
      stock.stockCacheService.update('q', { hits: [] });
      stock.clearCache();
      expect(stock.stockCacheService.load('q')).toBeNull();
    });
  });
});
