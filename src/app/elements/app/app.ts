import { attachStyle, attachTemplate, createCustomElement, injectChildrenInputs } from '@app/utils/custom-element.utils';
import { compileTemplate } from '@app/utils/template.utils';
import templateString from './app.hbs?raw';
import styleString from './app.scss?inline';

const template = compileTemplate(templateString);

export default async function createAppElement() {
  const { htmlElement } = await createCustomElement({
    selector: 'pen-app',
  });
  const shadowRoot = htmlElement.shadowRoot;
  const inputs = injectChildrenInputs(shadowRoot, { search: 'landscape' });

  attachStyle(shadowRoot, styleString);
  attachTemplate(shadowRoot, template(inputs));
}
