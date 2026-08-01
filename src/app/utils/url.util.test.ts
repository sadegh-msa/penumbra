import { describe, expect, it } from 'bun:test';
import { createHeaders, createQueryString } from './url.util';

describe('URL Utils', () => {
  describe('createQueryString', () => {
    it('should return an empty string for an empty query object', () => {
      const result = createQueryString({});
      expect(result).toBe('');
    });

    it('should convert a single string key-value pair', () => {
      const result = createQueryString({ query: 'nature' });
      expect(result).toBe('query=nature');
    });

    it('should convert number values', () => {
      const result = createQueryString({ page: 1 });
      expect(result).toBe('page=1');
    });

    it('should convert multiple key-value pairs', () => {
      const result = createQueryString({ query: 'nature', per_page: 20, page: 0 });
      expect(result).toBe('query=nature&per_page=20&page=0');
    });

    it('should preserve key order', () => {
      const result = createQueryString({ z: 'last', a: 'first' });
      expect(result).toBe('z=last&a=first');
    });
  });

  describe('createHeaders', () => {
    it('should create an empty Headers instance for an empty input', () => {
      const headers = createHeaders({});
      expect(headers).toBeInstanceOf(Headers);
    });

    it('should append string headers', () => {
      const headers = createHeaders({ Authorization: 'Bearer token' });
      expect(headers.get('Authorization')).toBe('Bearer token');
    });

    it('should stringify non-string header values', () => {
      const headers = createHeaders({ 'X-Count': 5 });
      expect(headers.get('X-Count')).toBe('5');
    });

    it('should preserve header key order', () => {
      const headers = createHeaders({ b: '2', a: '1' });
      expect([...headers.keys()]).toEqual(['b', 'a']);
    });
  });
});
