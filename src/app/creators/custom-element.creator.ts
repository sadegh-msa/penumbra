import { ElementAttribute, ElementClass, ElementCreator, ElementProperties } from '@models/element.model';
import { BehaviourSubject } from '@reactive/behaviour-subject';
import { Subject } from '@reactive/subject';

export function attachTemplate(shadowRoot: ShadowRoot, template: string) {
  const wrapperElement = document.createElement('div');
  wrapperElement.innerHTML = template.trim();
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < wrapperElement.childNodes.length; ++i) {
    fragment.appendChild(wrapperElement.childNodes[i]);
  }
  shadowRoot.appendChild(fragment);
}

export function attachStyle(shadowRoot: ShadowRoot, style: string) {
  const styleElement = document.createElement('style');
  styleElement.innerText = style.trim();
  shadowRoot.appendChild(styleElement);

  return styleElement;
}

export function createCustomElement(customElement: ElementProperties) {
  const inputSubject = new BehaviourSubject<ElementAttribute>(undefined);
  const htmlElementSubject = new Subject<ElementClass>();
  const HtmlElementClass = class extends HTMLElement {
    constructor() {
      super();

      const internals = this.attachInternals();

      if (!internals.shadowRoot) {
        this.attachShadow({ mode: 'open' });
      }
    }

    connectedCallback() {
      htmlElementSubject.next({ htmlElement: this });
    }

    disconnectedCallback() {
    }

    adoptedCallback() {
    }

    attributeChangedCallback(attribute: unknown, oldValue: unknown, newValue: unknown) {
      inputSubject.next({ attribute, oldValue, newValue });
    }

    static get observedAttributes() {
      return customElement.attributes || [];
    }
  };

  return new Promise<ElementCreator>((resolve, reject) => {
    const htmlElementSub = htmlElementSubject.subscribe(({ htmlElement }) => {
      htmlElementSubject.unsubscribe(htmlElementSub);
      const shadowRoot = htmlElement.shadowRoot;
      const fields: ElementCreator['fields'] = {};

      inputSubject.subscribe(async (data) => {
        if (!data) {
          return;
        }

        if (data.newValue.startsWith('@')) {
          fields[data.attribute] = window['penElements'][data.newValue.substring(1)];
          window['penElements'][data.newValue.substring(1)] = undefined;
        } else {
          fields[data.attribute] = data.newValue;
        }
      });

      customElements.whenDefined(customElement.selector).then(() => {
        resolve({ shadowRoot, fields });
      }).catch(reject);
    });

    customElements.define(customElement.selector, HtmlElementClass);
  });
}
