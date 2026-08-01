import type { PhotoStockCache } from '@models/photo.model';

export default class StockCacheService<T> {
  readonly #STORAGE_KEY_PREFIX = 'pen_stock_cache';
  readonly #LIFESPAN = 30; // Minutes

  #storageKey = `${this.#STORAGE_KEY_PREFIX}`;

  constructor(protected name: string) {
    this.#storageKey = `${this.#STORAGE_KEY_PREFIX}_${name}`;
  }

  #write(data: PhotoStockCache<T>) {
    localStorage.setItem(this.#storageKey, JSON.stringify(data));
  }

  #read(): PhotoStockCache<T> | null {
    const data = localStorage.getItem(this.#storageKey);
    return data ? JSON.parse(data) : null;
  }

  clear() {
    localStorage.removeItem(this.#storageKey);
  }

  update(query: string, response: T) {
    this.#write({
      query,
      response,
      date: new Date(),
      state: {}
    });
  }

  load(query: string): T | null {
    const cachedData = this.#read();

    if (cachedData?.query === query && cachedData?.response) {
      const lastUpdateDate = new Date(cachedData.date);
      const now = new Date();
      const lastUpdateDuration = (now.getTime() - lastUpdateDate.getTime()) / 1000 / 60;

      if (lastUpdateDuration <= this.#LIFESPAN) {
        return cachedData.response;
      }
    }

    return null;
  }
}
