import { describe, expect, it, spyOn } from 'bun:test';

describe('createAppElement', () => {
  it('should define a custom element and resolve when defined', async () => {
    const defineSpy = spyOn(customElements, 'define').mockImplementation(() => {});
    const whenDefinedSpy = spyOn(customElements, 'whenDefined').mockResolvedValue(undefined);
    const app = await import('./app');
    const promise = app.default();
    expect(defineSpy).toHaveBeenCalledWith('pen-app', expect.any(Function));
    await promise;
    expect(whenDefinedSpy).toHaveBeenCalledWith('pen-app');
    defineSpy.mockRestore();
    whenDefinedSpy.mockRestore();
  });
});
