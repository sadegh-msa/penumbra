import { attachStyle, attachTemplate, createCustomElement } from '@creators/custom-element.creator';
import style from './app.style.scss?inline';
import template from './app.template';

export default async function createAppElement() {
  const { htmlElement } = await createCustomElement({
    selector: 'pen-app',
  });
  const shadowRoot = htmlElement.shadowRoot!;

  attachStyle(shadowRoot, style);
  attachTemplate(shadowRoot, template(shadowRoot, { search: 'boat' }));
}
