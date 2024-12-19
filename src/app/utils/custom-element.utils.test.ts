import { attachStyle, attachTemplate, createCustomElement, fetchInput, injectChildrenInputs } from './custom-element.utils';

describe('Custom Element Utils', () => {
  let shadowRoot: ShadowRoot;

  beforeEach(() => {
    const div = document.createElement('div');
    shadowRoot = div.attachShadow({ mode: 'open' });
  });

  describe('attachTemplate', () => {
    it('should attach a template to the shadow root', () => {
      const template = '<p>Hello World</p>';
      attachTemplate(shadowRoot, template);
      expect(shadowRoot.innerHTML).toContain('<p>Hello World</p>');
    });
  });

  describe('attachStyle', () => {
    it('should attach a style to the shadow root', () => {
      const style = 'p { color: red; }';
      attachStyle(shadowRoot, style);
      expect(shadowRoot.innerHTML).toContain('<style>p { color: red; }</style>');
    });
  });

  describe('injectChildrenInputs', () => {
    it('should inject inputs into the shadow root host', () => {
      const inputs = { key1: 'value1', key2: 'value2' };
      const keyMap = injectChildrenInputs(shadowRoot, inputs);
      const host = shadowRoot.getRootNode()['host'];
      expect(Object.keys(keyMap)).toEqual(['key1', 'key2']);
      expect(Object.values(host.penInputs)).toEqual(['value1', 'value2']);
    });
  });

  describe('fetchInput', () => {
    it('should fetch input from the shadow root host', () => {
      const inputs = { key1: 'value1' };
      injectChildrenInputs(shadowRoot, inputs);
      const host = shadowRoot.getRootNode()['host'];
      const attributeValue = Object.keys(host.penInputs)[0];
      const fetchedValue = fetchInput(shadowRoot, attributeValue);
      expect(fetchedValue).toBe('value1');
    });

    it('should return the attribute value if it does not start with the prefix', () => {
      const attributeValue = 'someValue';
      const fetchedValue = fetchInput(shadowRoot, attributeValue);
      expect(fetchedValue).toBe(attributeValue);
    });
  });

  describe('createCustomElement', () => {
    it('should create a custom element and resolve the promise', async () => {
      const customElement = {
        selector: 'custom-element',
        attributes: ['attr1', 'attr2']
      };
      const elementCreator = await createCustomElement(customElement);
      expect(elementCreator).toHaveProperty('init$');
      expect(elementCreator).toHaveProperty('input$');
      expect(elementCreator).toHaveProperty('destroy$');
    });
  });
});
