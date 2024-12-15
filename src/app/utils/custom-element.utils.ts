import { ElementClass, ElementCreator, ElementInput, ElementProperties } from '@models/element.model';
import { BehaviourSubject } from '@reactive/behaviour-subject';
import { Subject } from '@reactive/subject';

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
  const input$ = new BehaviourSubject<ElementInput>(null);
  const destroy$ = new Subject<void>();
  const htmlElement$ = new Subject<ElementClass>();
  const HtmlElementClass = class extends HTMLElement {
    constructor() {
      super();

      const internals = this.attachInternals();

      if (!internals.shadowRoot) {
        this.attachShadow({ mode: 'open' });
      }
    }

    connectedCallback() {
      // console.log('Custom element added to page.');
      htmlElement$.next({ htmlElement: this });
    }

    disconnectedCallback() {
      destroy$.next(null);
      // console.log('Custom element removed from page.');
    }

    adoptedCallback() {
      // console.log('Custom element moved to new page.');
    }

    attributeChangedCallback(attribute: unknown, oldValue: unknown, newValue: unknown) {
      //console.log(`Attribute <${attribute}> has changed.`);
      // console.log({ attribute, oldValue, newValue });
      input$.next({ attribute, oldValue, newValue });
    }

    static get observedAttributes() {
      return customElement.attributes || [];
    }
  };

  return new Promise<ElementCreator>((resolve, reject) => {
    const htmlElementSub = htmlElement$.subscribe(({ htmlElement }) => {
      htmlElement$.unsubscribe(htmlElementSub);

      customElements.whenDefined(customElement.selector).then(() => {
        resolve({ htmlElement, input$, destroy$ });
      }).catch(reject);
    });

    customElements.define(customElement.selector, HtmlElementClass);
  });
}
