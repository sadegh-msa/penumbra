import { ElementClass, ElementCreator, ElementInput, ElementProperties } from '@models/element.model';
import { BehaviorSubject, filter, first, Subject, takeUntil } from 'rxjs';

const INPUTS_KEY = 'penInputs';

export function attachTemplate(shadowRoot: ShadowRoot, template: string) {
  const wrapperElement = document.createElement('div');
  wrapperElement.innerHTML = template.trim();
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < wrapperElement.childNodes.length; ++i) {
    fragment.appendChild(wrapperElement.childNodes[i]);
  }

  return shadowRoot.appendChild(fragment);
}

export function attachStyle(shadowRoot: ShadowRoot, style: string) {
  const styleElement = document.createElement('style');
  styleElement.innerText = style.trim();

  return shadowRoot.appendChild(styleElement);
}

export function injectChildrenInputs(shadowRoot: ShadowRoot, inputs: Record<string, unknown>) {
  const keyMap: Record<string, string> = {};
  const valueMap: Record<string, unknown> = {};

  const inputEntries = Object.entries(inputs || {});
  const inputEntriesLength = inputEntries.length;

  for (let i = 0; i < inputEntriesLength; i++) {
    const [key, value] = inputEntries[i];
    const uuid = crypto.randomUUID();
    keyMap[key] = uuid;
    valueMap[uuid] = value;
  }

  shadowRoot.getRootNode().host[INPUTS_KEY] = valueMap;

  return keyMap;
}

export function fetchInput<T = string>(htmlElement: HTMLElement, key: string) {
  const parentNode = htmlElement.getRootNode().host;
  return parentNode[INPUTS_KEY][key] as T;
}

export function createCustomElement(customElement: ElementProperties) {
  const init$ = new BehaviorSubject<ElementClass | null>(null);
  const destroy$ = new Subject<void>();
  const input$ = new Subject<ElementInput>();
  const HtmlElementClass = class extends HTMLElement {
    declare shadowRoot: ShadowRoot;

    static get observedAttributes() {
      return customElement.attributes || [];
    }

    constructor() {
      super();

      const internals = this.attachInternals();

      if (!internals.shadowRoot) {
        this.attachShadow({ mode: 'open' });
      }
    }

    connectedCallback() {
      // console.log('Custom element added to page.');
      init$.next({ htmlElement: this });

      const attributes = HtmlElementClass.observedAttributes;
      const attributesLength = attributes.length;

      for (let i = 0; i < attributesLength; i++) {
        const attribute = attributes[i];
        input$.next({ attribute, oldValue: null, newValue: this.getAttribute(attribute) });
      }
    }

    disconnectedCallback() {
      // console.log('Custom element removed from page.');
      destroy$.next();
    }

    adoptedCallback() {
      // console.log('Custom element moved to new page.');
    }

    attributeChangedCallback(attribute: string, oldValue: string, newValue: string) {
      //console.log(`Attribute <${attribute}> has changed.`);
      input$.next({ attribute, oldValue, newValue });
    }
  };

  return new Promise<ElementCreator>((resolve, reject) => {
    customElements.whenDefined(customElement.selector).then(() => {
      resolve({
        init$: init$.pipe(takeUntil(destroy$), filter(v => !!v)),
        input$: input$.pipe(takeUntil(destroy$), filter(v => !!v)),
        destroy$: destroy$.pipe(first()),
      });
    }).catch(reject);

    customElements.define(customElement.selector, HtmlElementClass);
  });
}
