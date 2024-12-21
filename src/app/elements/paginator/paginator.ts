import { attachStyle, attachTemplate, fetchInput } from '@app/utils/custom-element.utils';
import { compileTemplate } from '@app/utils/template.utils';
import type { Photographer } from '@models/photographer.model';
import { BehaviorSubject, filter, Subject, takeUntil } from 'rxjs';
import templateString from './paginator.hbs?raw';
import styleString from './paginator.scss?inline';

const template = compileTemplate(templateString);

export default async function createPaginatorElement() {
  const SELECTOR = 'pen-paginator';

  return new Promise(resolve => {
    customElements.whenDefined(SELECTOR).then(resolve);
    customElements.define(
      SELECTOR,
      class extends HTMLElement {
        declare shadowRoot: ShadowRoot;
        static observedAttributes = ['photographer'];
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
              if (attribute === 'photographer' && newValue) {
                const photographer = fetchInput<Photographer>(this, newValue);

                attachTemplate(this.shadowRoot, template({ photographer }));
              }
            });
        }
      }
    );
  });
}
