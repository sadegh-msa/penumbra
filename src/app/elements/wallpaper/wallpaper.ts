import { attachStyle, attachTemplate, createCustomElement, fetchInput, injectChildrenInputs } from '@app/utils/custom-element.utils';
import { compileTemplate } from '@app/utils/template.utils';
import type { Photo } from '@models/photo.model';
import { PhotoService } from '@services/photo.service';
import templateString from './wallpaper.hbs?raw';
import styleString from './wallpaper.scss?inline';

const template = compileTemplate(templateString);

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

  attachStyle(shadowRoot, styleString);

  const inputSub = input$.subscribe(async (data) => {
    if (!data) {
      return;
    }

    const { attribute, newValue } = data;

    if (attribute === 'search') {
      const searchQuery = fetchInput(htmlElement, newValue);
      const photo = (await search(photoService, searchQuery));

      if (photo) {
        const inputs = injectChildrenInputs(shadowRoot, { photographer: photo.photographer() });
        updateBackground(shadowRoot, photo);
        attachTemplate(shadowRoot, template(inputs));
      }
    }
  });

  const destroySub = destroy$.subscribe(() => {
    input$.unsubscribe(inputSub);
    destroy$.unsubscribe(destroySub);
  });
}
