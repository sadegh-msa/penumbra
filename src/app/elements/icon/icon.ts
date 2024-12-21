import { attachStyle, fetchInput } from '@app/utils/custom-element.utils';
import { BehaviorSubject, filter, Subject, takeUntil } from 'rxjs';
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
      return Promise.reject(new Error(`Response status: ${response.status}`));
    }

    const svgString = await response.text();

    if (svgString.startsWith('<!')) {
      return Promise.reject(new Error(`Error on fetching ${icon} icon`));
    }

    const wrapperElement = document.createElement('div');
    wrapperElement.innerHTML = svgString;
    const svgElement = wrapperElement.firstChild as SVGElement;
    svgElement.setAttribute('part', 'svg');
    shadowRoot.appendChild(svgElement);
  } catch (error) {
    console.error((error as Error).message);
  }
}

export default async function createIconElement() {
  const SELECTOR = 'pen-icon';

  return new Promise(resolve => {
    customElements.whenDefined(SELECTOR).then(resolve);
    customElements.define(
      SELECTOR,
      class extends HTMLElement {
        declare shadowRoot: ShadowRoot;
        static observedAttributes = ['icon'];
        readonly init$ = new BehaviorSubject<boolean>(false);
        readonly destroy$ = new Subject<void>();

        constructor() {
          super();

          const internals = this.attachInternals();

          if (!internals.shadowRoot) {
            this.attachShadow({ mode: 'open' });
          }
        }

        connectedCallback() {
          attachStyle(this.shadowRoot, styleString);
          this.init$.next(true);
        }

        disconnectedCallback() {
          this.destroy$.next();
          this.destroy$.unsubscribe();
        }

        attributeChangedCallback(attribute: string, oldValue: string, newValue: string) {
          this.init$.pipe(filter(v => v), takeUntil(this.destroy$))
            .subscribe(async () => {
              if (attribute === 'icon' && newValue) {
                const icon = fetchInput(this, newValue);
                await loadIcon(this.shadowRoot, icon);
              }
            });
        }
      }
    );
  });
}
