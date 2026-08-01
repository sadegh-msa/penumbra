import { describe, expect, it, spyOn } from 'bun:test';

describe('createPaginatorElement', () => {
  it('should define a custom element and resolve when defined', async () => {
    const defineSpy = spyOn(customElements, 'define').mockImplementation(() => {});
    const whenDefinedSpy = spyOn(customElements, 'whenDefined').mockResolvedValue(undefined);
    const paginator = await import('./paginator');
    const promise = paginator.default();
    expect(defineSpy).toHaveBeenCalledWith('pen-paginator', expect.any(Function));
    await promise;
    expect(whenDefinedSpy).toHaveBeenCalledWith('pen-paginator');
    defineSpy.mockRestore();
    whenDefinedSpy.mockRestore();
  });
});
