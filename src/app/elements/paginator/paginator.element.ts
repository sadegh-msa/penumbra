import { attachStyle, attachTemplate, createCustomElement } from '@creators/custom-element.creator';
import style from './paginator.style.scss?inline';
import template from './paginator.template';

export async function createPaginatorElement() {
  const { fields, shadowRoot } = await createCustomElement({
    selector: 'pen-paginator',
    attributes: ['photographer']
  });

  attachStyle(shadowRoot, style);
  attachTemplate(shadowRoot, template(fields));
}
