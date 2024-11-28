import { Observer } from '@models/reactive.model';

export class Subject<T> {
  readonly #subscribers = new Map<symbol, Observer>();

  subscribe(observer: Observer) {
    const key = Symbol();
    this.#subscribers.set(key, observer);
    return key;
  }

  unsubscribe(key: symbol) {
    return this.#subscribers.delete(key);
  }

  next(value: T | unknown) {
    const iterator = this.#subscribers.values();

    let observer = iterator.next().value;
    while (observer) {
      observer(value);
      observer = iterator.next().value;
    }
  }
}
