import type { Observable } from 'rxjs';

export type CustomHtmlElement = HTMLElement & { shadowRoot: ShadowRoot; };

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
  init$: Observable<CustomHtmlElement>;
  destroy$: Observable<void>;
  input$: Observable<ElementInput>;
}
