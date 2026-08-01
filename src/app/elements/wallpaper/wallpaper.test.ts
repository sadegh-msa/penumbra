import { describe, expect, it, spyOn } from 'bun:test';

describe('createWallpaperElement', () => {
  it('should define a custom element and resolve when defined', async () => {
    const defineSpy = spyOn(customElements, 'define').mockImplementation(() => {});
    const whenDefinedSpy = spyOn(customElements, 'whenDefined').mockResolvedValue(undefined);
    const wallpaper = await import('./wallpaper');
    const promise = wallpaper.default({});
    expect(defineSpy).toHaveBeenCalledWith('pen-wallpaper', expect.any(Function));
    await promise;
    expect(whenDefinedSpy).toHaveBeenCalledWith('pen-wallpaper');
    defineSpy.mockRestore();
    whenDefinedSpy.mockRestore();
  });
});
