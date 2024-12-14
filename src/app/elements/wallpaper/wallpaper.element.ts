import { attachStyle, attachTemplate, createCustomElement } from '@creators/custom-element.creator';
import { Photo } from '@models/photo.model';
import { PhotoService } from '@services/photo.service';
import style from './wallpaper.style.scss?inline';
import template from './wallpaper.template';

function updateBackground(shadowRoot: ShadowRoot, photo: Photo) {
  const style = `
      :host {
        .pen-wallpaper-photo::before {
          background-image: url(${photo.tinySize()});
        }

        .pen-wallpaper-photo::after {
          background-image: url(${photo.largeSize()});
        }
      }
    `;

  attachStyle(shadowRoot, style);
}

async function search<T>(photoService: PhotoService<T>, query: string) {
  photoService.photoSource.params.query = query;
  photoService.photoSource.params.page = 10;
  // this.photoService.photoSource.params.page = Math.floor(Math.random() * 80);

  const data = await photoService.loadPhotos();

  if (!data?.photos?.length) {
    photoService.clearCache();
    return;
  }

  return data.photos[((max) => Math.floor(Math.random() * max))(data.photos.length)];
}

export async function createWallpaperElement<T>(photoService: PhotoService<T>) {
  const { fields, shadowRoot } = await createCustomElement({
    selector: 'pen-wallpaper',
    attributes: ['search'],
  });

  const photo = await search(photoService, fields.search);
  attachStyle(shadowRoot, style);
  attachTemplate(shadowRoot, template({ ...fields, photo }));

  if (photo) {
    updateBackground(shadowRoot, photo);
  }
}
