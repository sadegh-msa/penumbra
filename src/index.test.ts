import { describe, expect, it, mock, spyOn } from 'bun:test';

mock('./styles/main.scss', () => ({}));

describe('index', () => {
  it('should be a valid module entry point', async () => {
    localStorage.setItem('pen_stock_key_PIXABAY', 'stored-key');
    const consoleErrorSpy = spyOn(console, 'error').mockImplementation(() => {});
    const module = await import('./index');
    expect(module).toBeDefined();
    expect(typeof module).toBe('object');
    consoleErrorSpy.mockRestore();
  });
});
