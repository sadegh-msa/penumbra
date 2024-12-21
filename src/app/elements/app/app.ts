import { attachStyle, attachTemplate, injectChildrenInputs } from '@app/utils/custom-element.utils';
import { compileTemplate } from '@app/utils/template.utils';
import templateString from './app.hbs?raw';
import styleString from './app.scss?inline';

const template = compileTemplate(templateString);

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
          const inputs = injectChildrenInputs(this.shadowRoot, { search: 'landscape' });
          attachStyle(this.shadowRoot, styleString);
          attachTemplate(this.shadowRoot, template(inputs));
        }
      }
    );
  });
}
