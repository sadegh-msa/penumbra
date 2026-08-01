export default class StockKeyService {
  readonly #STORAGE_KEY_PREFIX = 'pen_stock_key';

  #storageKey = `${this.#STORAGE_KEY_PREFIX}`;

  constructor(protected name: string) {
    this.#storageKey = `${this.#STORAGE_KEY_PREFIX}_${name}`;
  }

  #write(key: string) {
    localStorage.setItem(this.#storageKey, key);
  }

  #read(): string | null {
    return localStorage.getItem(this.#storageKey) || null;
  }

  getKey() {
    let key = this.#read();

    if (!key) {
      key = window.prompt('Get your API key from https://pixabay.com/api/docs/');

      this.#write(key || '');
    }

    return key;
  }
}
