import { Observable } from 'rxjs';

type HtmlElement = HTMLElement & { shadowRoot: ShadowRoot };

export interface ElementInput {
  attribute: string;
  oldValue: string | null;
  newValue: string | null;
}

export interface ElementProperties {
  selector: string;
  attributes?: string[];
}

export interface ElementCreator {
  init$: Observable<ElementClass>;
  destroy$: Observable<void>;
  input$: Observable<ElementInput>;
}

export interface ElementClass {
  htmlElement: HtmlElement;
}
