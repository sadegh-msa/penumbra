import { beforeEach, describe, expect, it, spyOn } from 'bun:test';
import StockKeyService from './stock-key.service';

describe('StockKeyService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('constructor', () => {
    it('should build a namespaced storage key from the provided name', () => {
      const service = new StockKeyService('pixabay');
      expect(service).toBeInstanceOf(StockKeyService);
    });
  });

  describe('getKey', () => {
    it('should return the stored key when one exists', () => {
      localStorage.setItem('pen_stock_key_PIXABAY', 'stored-key');
      const service = new StockKeyService('PIXABAY');
      const result = service.getKey();
      expect(result).toBe('stored-key');
    });

    it('should return null when no key exists and prompt is dismissed', () => {
      const service = new StockKeyService('PIXABAY');
      const promptSpy = spyOn(window, 'prompt').mockReturnValue(null);
      const result = service.getKey();
      expect(result).toBeNull();
      promptSpy.mockRestore();
    });

    it('should persist a provided key to localStorage', () => {
      const service = new StockKeyService('PIXABAY');
      const promptSpy = spyOn(window, 'prompt').mockReturnValue('new-key');
      service.getKey();
      expect(localStorage.getItem('pen_stock_key_PIXABAY')).toBe('new-key');
      promptSpy.mockRestore();
    });

    it('should persist an empty string when prompt returns empty input', () => {
      const service = new StockKeyService('PIXABAY');
      const promptSpy = spyOn(window, 'prompt').mockReturnValue('');
      service.getKey();
      expect(localStorage.getItem('pen_stock_key_PIXABAY')).toBe('');
      promptSpy.mockRestore();
    });
  });
});
