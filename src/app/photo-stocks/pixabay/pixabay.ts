import type { Photo, PhotoStock } from '@models/photo.model';
import StockCacheService from '@services/stock-cache.service';
import StockKeyService from '@services/stock-key.service';
import { createHeaders, createQueryString } from '@utils/url.util';
import type { PixabayResponse } from './pixabay-response.model';

export default class PixabayStock implements PhotoStock {
  readonly info = Object.freeze({
    name: 'PIXABAY',
    label: 'Pixabay.com',
    url: 'https://pixabay.com/api'
  });

  readonly stockKeyService = new StockKeyService(this.info.name);
  readonly stockCacheService = new StockCacheService(this.info.name);

  readonly #headers = {};

  readonly #params = {
    key: this.stockKeyService.getKey(),
    image_type: 'photo',
    category: 'nature',
    orientation: 'horizontal',
    min_width: window.innerWidth,
    min_height: window.innerHeight,
    editors_choice: true,
    per_page: 20,
    page: 1
  };

  readonly #setParamMap = {
    query: 'q',
    width: 'min_width',
    heigh: 'min_height',
    editorsChoice: 'editors_choice',
    perPage: 'per_page'
  };

  set page(page: number) {
    this.setParam('page', page);
  }

  get page() {
    return this.getParam('page') as number;
  }

  set query(query: string) {
    this.setParam('query', query);
  }

  get query() {
    return this.getParam('query') as string;
  }

  setParam(param: string, value: boolean | number | string) {
    const nativeParam = this.#setParamMap[param] || param;
    this.#params[nativeParam] = value;
  }

  getParam(param: string) {
    const nativeParam = this.#setParamMap[param] || param;
    return this.#params[nativeParam];
  }

  async #request(): PixabayResponse {
    const queryString = createQueryString(this.#params);
    const cachedResponse = this.stockCacheService.load(queryString) || null;

    if (cachedResponse) {
      return cachedResponse as PixabayResponse;
    }

    const init = {
      method: 'GET',
      headers: createHeaders(this.#headers),
      mode: 'cors',
      cache: 'no-store'
    } as RequestInit;

    const request = new Request(`${this.info.url}?${queryString}`);
    const response = (await fetch(request, init)).json();
    this.stockCacheService.update(queryString, response);

    return response;
  }

  async loadPhotos() {
    const photos: Photo[] = [];
    const response = await this.#request();
    const responsePhotosLength = response.hits.length;

    for (let i = 0; i < responsePhotosLength; i++) {
      const photo = response.hits[i];

      photos.push({
        tinyUrl: () => photo.previewURL,
        largeUrl: () => photo.largeImageURL,
        averageColor: () => 'black',
        photographer: () => {
          return {
            id: photo.user_id,
            name: photo.user,
            url: photo.userURL
          };
        }
      });
    }

    return photos;
  }

  clearCache() {
    this.stockCacheService.clear();
  }
}
