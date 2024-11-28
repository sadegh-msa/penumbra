import { Photographer } from './photographer.model';

export interface Photo {
  tinySize: () => string;
  largeSize: () => string;
  photographer: () => Photographer;
}
