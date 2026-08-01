import { attachStyle, attachTemplate, injectChildrenInputs } from '@app/utils/custom-element.util';
import { createTemplate } from '@app/utils/template.util';
import templateString from 'src/app/elements/app/app.html?raw';
import styleString from './app.scss?inline';

const template = createTemplate(templateString);

export default async function createAppElement() {
  const SELECTOR = 'pen-app';

  return new Promise(resolve => {
    customElements.whenDefined(SELECTOR).then(resolve);
    customElements.define(
      SELECTOR,
      class extends HTMLElement {
        declare shadowRoot: ShadowRoot;

        constructor() {
          super();

          const internals = this.attachInternals();

          if (!internals.shadowRoot) {
            this.attachShadow({ mode: 'open' });
          }
        }

        connectedCallback() {
          attachStyle(this.shadowRoot, styleString);
          attachTemplate(this.shadowRoot, template);
          const wallpaperElement = this.shadowRoot.querySelector('pen-wallpaper');

          if (wallpaperElement) {
            const inputs = injectChildrenInputs(this.shadowRoot, { search: 'garden' });
            wallpaperElement.setAttribute('search', inputs.search);
          }
        }
      }
    );
  });
}
