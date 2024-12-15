import { attachStyle, attachTemplate, createCustomElement, fetchInput, injectChildrenInputs } from '@app/utils/custom-element.utils';
import { compileTemplate } from '@app/utils/template.utils';
import type { Photographer } from '@models/photographer.model';
import templateString from './paginator.hbs?raw';
import styleString from './paginator.scss?inline';

const template = compileTemplate(templateString);

export default async function createPaginatorElement() {
  const { input$, destroy$, htmlElement } = await createCustomElement({
    selector: 'pen-paginator',
    attributes: ['photographer']
  });
  const shadowRoot = htmlElement.shadowRoot;

  attachStyle(shadowRoot, styleString);

  const inputSub = input$.subscribe(async (data) => {
    if (!data) {
      return;
    }

    const { attribute, newValue } = data;

    if (attribute === 'photographer') {
      const photographer = fetchInput<Photographer>(htmlElement, newValue);
      const inputs = injectChildrenInputs(shadowRoot, { cameraIcon: 'outline/camera' });

      attachTemplate(shadowRoot, template({ photographer, ...inputs }));
    }
  });

  const destroySub = destroy$.subscribe(() => {
    input$.unsubscribe(inputSub);
    destroy$.unsubscribe(destroySub);
  });
}
