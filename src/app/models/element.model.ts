/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ElementAttribute {
  attribute: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface ElementProperties {
  selector: string;
  attributes?: string[];
}

export interface ElementCreator {
  shadowRoot: ShadowRoot;
  fields: Record<string, any>;
}

export interface ElementClass {
  htmlElement: HTMLElement;
}
