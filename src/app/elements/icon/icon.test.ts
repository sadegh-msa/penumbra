import { describe, expect, it, spyOn } from 'bun:test';

describe('createIconElement', () => {
  it('should define a custom element and resolve when defined', async () => {
    const defineSpy = spyOn(customElements, 'define').mockImplementation(() => {});
    const whenDefinedSpy = spyOn(customElements, 'whenDefined').mockResolvedValue(undefined);
    const icon = await import('./icon');
    const promise = icon.default();
    expect(defineSpy).toHaveBeenCalledWith('pen-icon', expect.any(Function));
    await promise;
    expect(whenDefinedSpy).toHaveBeenCalledWith('pen-icon');
    defineSpy.mockRestore();
    whenDefinedSpy.mockRestore();
  });
});
