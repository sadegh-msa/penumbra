import { attachStyle, attachTemplate, fetchInput } from '@app/utils/custom-element.utils';
import { createTemplate } from '@app/utils/template.utils';
import templateString from '@elements/paginator/paginator.html?raw';
import type { Photographer } from '@models/photographer.model';
import type { Subscription } from 'rxjs';
import { BehaviorSubject, filter, fromEvent, Subject, takeUntil } from 'rxjs';
import style from './paginator.scss?inline';

const template = createTemplate(templateString);

export default async function createPaginatorElement() {
  const SELECTOR = 'pen-paginator';

  return new Promise(resolve => {
    customElements.whenDefined(SELECTOR).then(resolve);
    customElements.define(
      SELECTOR,
      class extends HTMLElement {
        declare shadowRoot: ShadowRoot;
        static observedAttributes = ['photographer', 'photoindex'];
        readonly init$ = new BehaviorSubject<boolean>(false);
        readonly destroy$ = new Subject<void>();
        photographerSub?: Subscription;
        photographerElement: HTMLAnchorElement | null;

        constructor() {
          super();

          const internals = this.attachInternals();

          if (!internals.shadowRoot) {
            this.attachShadow({ mode: 'open' });
          }
        }

        connectedCallback() {
          attachStyle(this.shadowRoot, style);
          attachTemplate(this.shadowRoot, template);
          this.photographerElement = this.shadowRoot.querySelector('a#paginator-photographer');
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
                const photographer$ = fetchInput<Subject<Photographer>>(this, newValue);
                this.settlePhotographerHandler(photographer$);
              }

              if (attribute === 'photoindex' && newValue) {
                const photoIndex$ = fetchInput<BehaviorSubject<number>>(this, newValue);
                this.settlePaginationHandlers(photoIndex$);
              }
            });
        }

        settlePaginationHandlers(photoIndex$: BehaviorSubject<number>) {
          fromEvent(this.shadowRoot.getElementById('paginator-next')!, 'click')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => photoIndex$.next(photoIndex$.value + 1));

          fromEvent(this.shadowRoot.getElementById('paginator-previous')!, 'click')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => photoIndex$.next(photoIndex$.value - 1));
        }

        settlePhotographerHandler(photographer$: Subject<Photographer>) {
          this.photographerSub?.unsubscribe();
          this.photographerSub = photographer$
            .pipe(takeUntil(this.destroy$))
            .subscribe(photographer => {
              const element = this.photographerElement!;
              element.href = photographer.url;
              element.title = `Photographer: ${photographer.name}`;
              element.querySelector('span')!.textContent = photographer.name;
            });
        }
      }
    );
  });
}
