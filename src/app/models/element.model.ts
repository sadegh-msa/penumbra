/* eslint-disable @typescript-eslint/no-explicit-any */

import { BehaviourSubject } from '@reactive/behaviour-subject';
import { Subject } from '@reactive/subject';

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
  htmlElement: HTMLElement;
  destroy$: Subject<void>;
  input$: BehaviourSubject<ElementInput>;
}

export interface ElementClass {
  htmlElement: HTMLElement;
}
