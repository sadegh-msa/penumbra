import { Observer } from '@models/reactive.model';

export class BehaviourSubject<T> {
  readonly #subscribers = new Map<symbol, Observer>();
  #value: T | unknown;

  constructor(value: T | unknown) {
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  subscribe(observer: Observer) {
    const key = Symbol();
    this.#subscribers.set(key, observer);
    observer(this.#value);

    return key;
  }

  unsubscribe(key: symbol) {
    return this.#subscribers.delete(key);
  }

  next(value: T | unknown) {
    const iterator = this.#subscribers.values();
    this.#value = value;

    let observer = iterator.next().value;
    while (observer) {
      observer(this.#value);
      observer = iterator.next().value;
    }
  }
}
