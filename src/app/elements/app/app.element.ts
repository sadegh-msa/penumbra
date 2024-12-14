import { attachStyle, attachTemplate, createCustomElement } from '@creators/custom-element.creator';
import style from './app.style.scss?inline';
import template from './app.template';

export async function createAppElement() {
  const { fields, shadowRoot } = await createCustomElement({
    selector: 'pen-app',
  });

  attachStyle(shadowRoot, style);
  attachTemplate(shadowRoot, template(fields));
}
