import { BehaviourSubject } from '@reactive/behaviour-subject';
import { Subject } from '@reactive/subject';

type HtmlElement = HTMLElement & { shadowRoot: ShadowRoot };

export interface ElementInput {
  attribute: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface ElementProperties {
  selector: string;
  attributes?: string[];
}

export interface ElementCreator {
  htmlElement: HtmlElement;
  destroy$: Subject<void>;
  input$: BehaviourSubject<ElementInput>;
}

export interface ElementClass {
  htmlElement: HtmlElement;
}
