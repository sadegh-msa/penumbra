import { cloneDeep } from 'lodash-es';

export class BehaviourSubject<T> {
  protected myValue: T | unknown;
  protected readonly subscribers = new Map();

  constructor(value: T | unknown) {
    this.myValue = value;
  }

  get value(): T | unknown {
    return this.myValue;
  }

  subscribe(func: (...args) => void): symbol {
    const key = Symbol();
    this.subscribers.set(key, func);
    this.subscribers.get(key)(this.myValue);
    return key;
  }

  unsubscribe(key: symbol): boolean {
    return this.subscribers.delete(key);
  }

  next(value: T | unknown): void {
    this.myValue = cloneDeep(value);

    for (const subscriber of this.subscribers.values()) {
      subscriber(this.myValue);
    }
  }
}
