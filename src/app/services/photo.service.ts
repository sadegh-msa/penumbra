import { convertToQueryString } from '@app/utils/url.utils';
import type { PhotoResponse, PhotoSource, PhotoSourceCache } from '@models/photo.model';

export default function makeGetPhotoService<T>() {
  const CACHE_KEY = 'pen_photos_service';
  const CACHE_TIME_DURATION = 30; // Minutes

  const writeToCache = (data: PhotoSourceCache<T>) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  };
  const readFromCache = (): PhotoSourceCache<T> => {
    const data = localStorage.getItem(CACHE_KEY);
    return data ? JSON.parse(data) : null;
  };

  return function getPhotoService(photoSource: PhotoSource<T>) {
    const updateState = (response: T) => {
      writeToCache({
        photoSource,
        response,
        date: new Date(),
        state: {}
      });
    };

    const sendRequest = async (): Promise<T> => {
      const queryString = convertToQueryString(photoSource.params);
      const request = new Request(`${photoSource.url}?${queryString}`);
      const headers = new Headers();
      const photoHeaders = Object.keys(photoSource.headers);
      const photoHeadersLength = photoHeaders.length;

      for (let i = 0; i < photoHeadersLength; i++) {
        const header = photoHeaders[i];
        headers.append(header, photoSource.headers[header]);
      }

      const init = {
        method: 'GET',
        headers,
        mode: 'cors',
        cache: 'no-store'
      } as RequestInit;

      return (await fetch(request, init)).json();
    };

    return {
      photoSource,
      clearCache: () => {
        localStorage.removeItem(CACHE_KEY);
      },
      loadPhotos: async (): Promise<PhotoResponse<T>> => {
        const cachedData = readFromCache();

        if (
          cachedData?.photoSource.params.query === photoSource.params.query
          && cachedData?.photoSource.params.page === photoSource.params.page
          && cachedData?.response
        ) {
          const lastUpdateDate = new Date(cachedData.date);
          const now = new Date();
          const lastUpdateDuration = (now.getTime() - lastUpdateDate.getTime()) / 1000 / 60;

          if (lastUpdateDuration <= CACHE_TIME_DURATION) {
            return {
              originalResponse: cachedData.response,
              photos: photoSource.extractPhotos(cachedData.response)
            };
          }
        }

        const response = await sendRequest();
        updateState(response);

        return {
          originalResponse: response,
          photos: photoSource.extractPhotos(response)
        };
      }
    };
  };
}
