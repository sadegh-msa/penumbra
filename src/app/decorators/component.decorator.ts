/* eslint-disable @typescript-eslint/no-explicit-any */

import { OnInit } from '@interfaces/component.interface';
import { ComponentArguments } from '@models/component-arguments.mode';
import { ComponentElement } from '@models/component-element.model';
import { ComponentInput } from '@models/component-input.model';
import { BehaviourSubject } from '@reactive/behaviour-subject';
import { Subject } from '@reactive/subject';
import { SvgIconsService } from '@services/svg-icons.service';
import { inputField } from './input.decorator';

function isOnInit(arg: any): arg is OnInit {
  return typeof arg?.fcOnInit === 'function';
}

type Constructor<T> = new (...args: any[]) => T;

export function Component(args: ComponentArguments) {
  const inputAttributes: string[] = [];
  const inputSubject = new BehaviourSubject<ComponentInput>(undefined);
  const htmlElementSubject = new Subject<ComponentElement>();
  const htmlElementClass = class extends HTMLElement {
    constructor() {
      super();

      (async () => {
        try {
          this.attachShadow({ mode: 'open' });

          await this.attachStyle(args.style);
          await this.attachTemplate(args.selector, args.template);
          await this.attachStyle('');
          this.loadIcons();

          htmlElementSubject.next({
            shadowRoot: this.shadowRoot,
          });
        } catch (error) {
          console.error(error);
        }
      })();
    }

    connectedCallback() {
      undefined;
    }

    disconnectedCallback() {
      undefined;
    }

    adoptedCallback() {
      undefined;
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
      inputSubject.next({ attribute, oldValue, newValue });
    }

    static get observedAttributes() {
      return inputAttributes;
    }

    async attachTemplate(selector: string, template: Promise<any> | string): Promise<void> {
      const rootElement = document.createElement('div');
      rootElement.className = selector;
      rootElement.innerHTML = template instanceof Promise ? (await template).default : template;
      this.shadowRoot?.appendChild(rootElement);
    }

    async attachStyle(style: Promise<any> | string): Promise<void> {
      if (style instanceof Promise) {
        (await style).default.use({ target: this.shadowRoot });
      } else {
        const styleElement = document.createElement('style');
        styleElement.textContent = style;
        this.shadowRoot?.appendChild(styleElement);
      }
    }

    loadIcons(): void {
      SvgIconsService.instance.loadIcons(this.shadowRoot?.children[1]);
    }
  };

  return function <T extends Constructor<any>>(BaseClass: T) {
    return class extends BaseClass {
      constructor(..._args: any[]) {
        super(..._args);

        const attrs = Object.keys(this[inputField] || {});
        const attrsLength = attrs.length;

        for (let i = 0; i < attrsLength; i++) {
          inputAttributes.push(attrs[i]);
        }

        const htmlElementSub = htmlElementSubject.subscribe(data => {
          BaseClass.prototype.shadowRoot = data.shadowRoot;

          inputSubject.subscribe(data => {
            if (!data) {
              return;
            }

            let value;

            try {
              value = JSON.parse(data.newValue);
            } catch (error) {
              value = data.newValue;
            }

            const property = this[inputField][data.attribute];
            this[property] = value;
          });

          if (isOnInit(this)) {
            this.fcOnInit();
          }

          htmlElementSubject.unsubscribe(htmlElementSub);
        });

        customElements.define(args.selector, htmlElementClass);
      }
    };
  };
}
