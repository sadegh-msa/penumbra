import { attachStyle, createCustomElement } from '@creators/custom-element.creator';
import style from './icon.style.scss?inline';

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

export async function createIconElement() {
  const { fields, shadowRoot } = await createCustomElement({
    selector: 'pen-icon',
    attributes: ['icon']
  });

  attachStyle(shadowRoot, style);
  loadIcon(shadowRoot, fields.icon);
}
