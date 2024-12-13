/* eslint-disable @typescript-eslint/no-explicit-any */

import { ComponentArguments, ComponentElement, ComponentEssentials, ComponentInput } from '@models/component.model';
import { BehaviourSubject } from '@reactive/behaviour-subject';
import { Subject } from '@reactive/subject';
import { inputField } from './component-input.decorator';

type Constructor<T> = new (...args: any[]) => T;

function hasOnInit(arg: any): arg is ComponentEssentials {
  return typeof arg?.onInit === 'function';
}

function attachTemplate(shadowRoot: ShadowRoot, template: string) {
  const wrapperElement = document.createElement('div');
  wrapperElement.innerHTML = template.trim();
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < wrapperElement.childNodes.length; ++i) {
    fragment.appendChild(wrapperElement.childNodes[i]);
  }
  shadowRoot.appendChild(fragment);
}

function attachStyle(shadowRoot: ShadowRoot, style: string) {
  const styleElement = document.createElement('style');
  styleElement.innerText = style.trim();
  shadowRoot.appendChild(styleElement);
}

export function Component(args: ComponentArguments) {
  const inputAttributes: string[] = [];
  const inputSubject = new BehaviourSubject<ComponentInput>(undefined);
  const htmlElementSubject = new Subject<ComponentElement>();
  const HtmlElementClass = class extends HTMLElement {
    constructor() {
      super();

      const internals = this.attachInternals()

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
      return inputAttributes;
    }
  };

  return function <T extends Constructor<any>>(BaseClass: T) {
    return class extends BaseClass {
      shadowRoot: ShadowRoot;

      constructor(..._args: any[]) {
        super(..._args);

        const attrs = Object.keys(this[inputField] || {});
        const attrsLength = attrs.length;

        for (let i = 0; i < attrsLength; i++) {
          inputAttributes.push(attrs[i]);
        }

        const htmlElementSub = htmlElementSubject.subscribe(({ htmlElement }) => {
          this.shadowRoot = htmlElement.shadowRoot;

          if (args.style) {
            attachStyle(this.shadowRoot, args.style);
          }

          attachStyle(this.shadowRoot, '');

          inputSubject.subscribe(async (data) => {
            if (!data) {
              return;
            }

            const property = this[inputField][data.attribute];
            if (data.newValue.startsWith('@')) {
              this[property] = window['penComponents'][data.newValue.substring(1)];
              window['penComponents'][data.newValue.substring(1)] = undefined;
            } else {
              this[property] = data.newValue;
            }
          });

          customElements.whenDefined(args.selector).then(() => {
            if (args.template) {
              attachTemplate(this.shadowRoot, args.template(this));
            }

            if (hasOnInit(this)) {
              this.onInit();
            }
          });

          htmlElementSubject.unsubscribe(htmlElementSub);
        });

        customElements.define(args.selector, HtmlElementClass);
      }
    };
  };
}
