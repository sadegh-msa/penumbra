import { attachStyle, attachTemplate, createCustomElement } from '@creators/custom-element.creator';
import type { Photo } from '@models/photo.model';
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
  // photoService.photoSource.params.page = 1;
  photoService.photoSource.params.page = Math.floor(Math.random() * 80);

  const data = await photoService.loadPhotos();

  if (!data?.photos?.length) {
    photoService.clearCache();
    return;
  }

  return data.photos[((max) => Math.floor(Math.random() * max))(data.photos.length)];
}

export default async function createWallpaperElement<T>(photoService: PhotoService<T>) {
  const { input$, destroy$, htmlElement } = await createCustomElement({
    selector: 'pen-wallpaper',
    attributes: ['search'],
  });
  const shadowRoot = htmlElement.shadowRoot!;

  attachStyle(shadowRoot, style);

  const inputSub = input$.subscribe(async (data) => {
    if (!data) {
      return;
    }

    const { attribute, newValue } = data;

    if (attribute === 'search') {
      const parentNode = htmlElement.getRootNode().host;
      const searchQuery = parentNode['penInputs'][newValue];
      const photo = (await search(photoService, searchQuery)) as Photo;

      if (photo) {
        updateBackground(shadowRoot, photo);
      }

      attachTemplate(shadowRoot, template(shadowRoot, { photo }));
    }
  });

  const destroySub = destroy$.subscribe(() => {
    input$.unsubscribe(inputSub);
    destroy$.unsubscribe(destroySub);
  });
}
