import type { Photographer } from './photographer.model';

export interface Photo {
  tinyUrl: () => string;
  largeUrl: () => string;
  averageColor: () => string;
  photographer: () => Photographer;
}

export interface PhotoStock {
  info: { name: string; label: string; url: string; };
  page: number;
  query: string;
  setParam: (param: string, value: boolean | number | string) => void;
  getParam: (param: string) => boolean | number | string;
  clearCache: () => void;
  loadPhotos: () => Promise<Photo[]>;
}

export interface PhotoStockCache<T> {
  query: string;
  response: T;
  date: Date;
  state: Record<string, string | number | unknown>;
}
