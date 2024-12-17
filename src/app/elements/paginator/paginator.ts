import { attachStyle, attachTemplate, createCustomElement, fetchInput, injectChildrenInputs } from '@app/utils/custom-element.utils';
import { compileTemplate } from '@app/utils/template.utils';
import type { Photographer } from '@models/photographer.model';
import templateString from './paginator.hbs?raw';
import styleString from './paginator.scss?inline';

const template = compileTemplate(templateString);

export default async function createPaginatorElement() {
  const { init$, input$ } = await createCustomElement({
    selector: 'pen-paginator',
    attributes: ['photographer']
  });

  init$.subscribe(({ htmlElement }) => {
    const shadowRoot = htmlElement.shadowRoot;

    attachStyle(shadowRoot, styleString);

    input$.subscribe(async (data) => {
      const { attribute, newValue } = data;

      if (attribute === 'photographer' && newValue) {
        const photographer = fetchInput<Photographer>(htmlElement, newValue);

        attachTemplate(shadowRoot, template({ photographer }));
      }
    });
  });
}
