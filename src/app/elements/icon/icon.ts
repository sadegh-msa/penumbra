import { attachStyle, createCustomElement, fetchInput } from '@app/utils/custom-element.utils';
import styleString from './icon.scss?inline';

function getIconUrl(icon: string) {
  return `icons/${icon}.svg`;
}

function loadIcon(shadowRoot: ShadowRoot, icon: string) {
  if ([...shadowRoot.childNodes].map(i => i.nodeName).includes('svg')) {
    return;
  }

  fetch(getIconUrl(icon)).then(response => {
    (async () => {
      const wrapperElement = document.createElement('div');
      wrapperElement.innerHTML = await response.text();
      const svgElement = wrapperElement.firstChild as SVGElement;
      svgElement.setAttribute('part', 'svg');

      if (svgElement) {
        shadowRoot.appendChild(svgElement);
      }
    })();
  });
}

export default async function createIconElement() {
  const { input$, destroy$, htmlElement } = await createCustomElement({
    selector: 'pen-icon',
    attributes: ['icon']
  });
  const shadowRoot = htmlElement.shadowRoot!;

  attachStyle(shadowRoot, styleString);

  const inputSub = input$.subscribe(async (data) => {
    if (!data) {
      return;
    }

    const { attribute, newValue } = data;

    if (attribute === 'icon') {
      const icon = fetchInput(htmlElement, newValue);
      loadIcon(shadowRoot, icon);
    }
  });

  const destroySub = destroy$.subscribe(() => {
    input$.unsubscribe(inputSub);
    destroy$.unsubscribe(destroySub);
  });
}
