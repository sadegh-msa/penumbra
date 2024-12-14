import { convertToQueryString } from '@helpers/url.helper';
import { PhotoResponse } from '@models/photo-response.model';
import { PhotoSourceCache } from '@models/photo-source-cache.model';
import { PhotoSource } from '@models/photo-source.model';

export class PhotoService<T> {
  readonly CACHE_KEY = 'pen_photos_service';
  readonly CACHE_TIME_DURATION = 30; // Minutes

  constructor(public photoSource: PhotoSource<T>) {
  }

  writeToCache(data: PhotoSourceCache<T>) {
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
  }

  readFromCache(): PhotoSourceCache<T> {
    const data = localStorage.getItem(this.CACHE_KEY);
    return data ? JSON.parse(data) : null;
  }

  clearCache() {
    localStorage.removeItem(this.CACHE_KEY);
  }

  updateState(response: T) {
    this.writeToCache({
      photoSource: this.photoSource,
      response: response,
      date: new Date(),
      state: {}
    });
  }

  async loadPhotos(): Promise<PhotoResponse<T>> {
    const cachedData = this.readFromCache();

    if (cachedData?.photoSource.params.query === this.photoSource.params.query
      && cachedData?.photoSource.params.page === this.photoSource.params.page
      && cachedData?.response) {
      const lastUpdateDate = new Date(cachedData.date);
      const now = new Date();
      const lastUpdateDuration = (now.getTime() - lastUpdateDate.getTime()) / 1000 / 60;

      if (lastUpdateDuration <= this.CACHE_TIME_DURATION) {
        return {
          originalResponse: cachedData.response,
          photos: this.photoSource.extractPhotos(cachedData.response)
        };
      }
    }

    const response = await this.sendRequest();
    this.updateState(response);

    return {
      originalResponse: response,
      photos: this.photoSource.extractPhotos(response)
    };
  }

  async sendRequest(): Promise<T> {
    const queryString = convertToQueryString(this.photoSource.params);
    const request = new Request(`${this.photoSource.url}?${queryString}`);
    const headers = new Headers();
    const photoHeaders = Object.keys(this.photoSource.headers);
    const photoHeadersLength = photoHeaders.length;

    for (let i = 0; i < photoHeadersLength; i++) {
      const header = photoHeaders[i];
      headers.append(header, this.photoSource.headers[header]);
    }

    const init = {
      method: 'GET',
      headers: headers,
      mode: 'cors',
      cache: 'no-store'
    } as RequestInit;

    return (await fetch(request, init)).json();
  }
}
