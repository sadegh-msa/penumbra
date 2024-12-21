import type { Photographer } from './photographer.model';

export interface Photo {
  tinyUrl: () => string;
  largeUrl: () => string;
  averageColor: () => string;
  photographer: () => Photographer;
}

export interface PhotoResponse<T> {
  originalResponse: T;
  photos: Photo[];
}

export interface PhotoSource<T> {
  name: string;
  label: string;
  url: string;
  headers: { [key: string]: string; };
  params: { [key: string]: string | number | unknown; };
  extractPhotos: (r: T) => Photo[];
}

export interface PhotoSourceCache<T> {
  photoSource: PhotoSource<T>;
  response: T;
  date: Date;
  state: { [key: string]: string | number | unknown; };
}

export interface PhotoService<T> {
  photoSource: PhotoSource<T>;
  clearCache: () => void;
  loadPhotos: () => Promise<PhotoResponse<T>>;
}
