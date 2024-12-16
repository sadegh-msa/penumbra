import { attachStyle, createCustomElement, fetchInput } from '@app/utils/custom-element.utils';
import styleString from './icon.scss?inline';

function getIconUrl(icon: string) {
  return `icons/${icon}.svg`;
}

async function loadIcon(shadowRoot: ShadowRoot, icon: string) {
  if ([...shadowRoot.childNodes].map(i => i.nodeName).includes('svg')) {
    return;
  }

  try {
    const response = await fetch(getIconUrl(icon));

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const svgString = await response.text();

    if (svgString.startsWith('<!')) {
      throw new Error(`Error on fetching ${icon} icon`);
    }

    const wrapperElement = document.createElement('div');
    wrapperElement.innerHTML = svgString;
    const svgElement = wrapperElement.firstChild as SVGElement;
    svgElement.setAttribute('part', 'svg');
    shadowRoot.appendChild(svgElement);
  } catch (error) {
    console.error(error.message);
  }
}

export default async function createIconElement() {
  const { init$, input$ } = await createCustomElement({
    selector: 'pen-icon',
    attributes: ['icon']
  });

  init$.subscribe(({ htmlElement }) => {
    const shadowRoot = htmlElement.shadowRoot!;

    attachStyle(shadowRoot, styleString);

    input$.subscribe(async (data) => {
      const { attribute, newValue } = data;

      if (attribute === 'icon' && newValue) {
        const icon = fetchInput(htmlElement, newValue);
        await loadIcon(shadowRoot, icon);
      }
    });
  });
}
