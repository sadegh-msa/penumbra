/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ComponentInput {
  attribute: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface ComponentArguments {
  selector: string;
  template?: (params?: any) => string;
  style?: Promise<any> | any;
}

export interface ComponentElement {
  htmlElement: HTMLElement;
}

export interface ComponentEssentials {
  onInit(): void;
  shadowRoot: ShadowRoot;
}
