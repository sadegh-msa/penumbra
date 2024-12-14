import { attachStyle, attachTemplate, createCustomElement } from '@creators/custom-element.creator';
import type { Photographer } from '@models/photographer.model';
import style from './paginator.style.scss?inline';
import template from './paginator.template';

export default async function createPaginatorElement() {
  const { input$, destroy$, htmlElement } = await createCustomElement({
    selector: 'pen-paginator',
    attributes: ['photographer']
  });
  const shadowRoot = htmlElement.shadowRoot!;

  attachStyle(shadowRoot, style);

  const inputSub = input$.subscribe(async (data) => {
    if (!data) {
      return;
    }

    const { attribute, newValue } = data;

    if (attribute === 'photographer') {
      const parentNode = htmlElement.getRootNode().host;
      const photographer = parentNode['penInputs'][newValue] as Photographer;
      attachTemplate(shadowRoot, template(shadowRoot, { photographer }));
    }
  });

  const destroySub = destroy$.subscribe(() => {
    input$.unsubscribe(inputSub);
    destroy$.unsubscribe(destroySub);
  });
}
