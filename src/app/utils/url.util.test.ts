import { beforeEach, describe, expect, it } from 'bun:test';
import { convertToQueryString } from './url.util';

describe('URL Utils', () => {
  describe('convertToQueryString', () => {
    it('should return an empty string for an empty query object', () => {
      const result = convertToQueryString({});
      expect(result).toBe('');
    });

    it('should convert a single string key-value pair', () => {
      const result = convertToQueryString({ query: 'nature' });
      expect(result).toBe('&query="nature"');
    });

    it('should convert number values', () => {
      const result = convertToQueryString({ page: 1 });
      expect(result).toBe('&page=1');
    });

    it('should convert multiple key-value pairs', () => {
      const result = convertToQueryString({ query: 'nature', per_page: 20, page: 0 });
      expect(result).toBe('&query="nature"&per_page=20&page=0');
    });

    it('should preserve key order', () => {
      const result = convertToQueryString({ z: 'last', a: 'first' });
      expect(result).toBe('&z="last"&a="first"');
    });
  });
});
