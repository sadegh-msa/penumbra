import {
  attachStyle,
  attachTemplate,
  createCustomElement,
  fetchInput,
  injectChildrenInputs
} from '@app/utils/custom-element.utils';
import { compileTemplate } from '@app/utils/template.utils';
import type { Photo, PhotoService } from '@models/photo.model';
import { first, fromEvent, type Observable, takeUntil } from 'rxjs';
import templateString from './wallpaper.hbs?raw';
import styleString from './wallpaper.scss?inline';

const template = compileTemplate(templateString);

function updateWallpaper(shadowRoot: ShadowRoot, photo: Photo, destroy$: Observable<void>) {
  const wallpaperElement = shadowRoot.getElementById('wallpaper');

  if (!wallpaperElement) {
    return;
  }

  wallpaperElement.innerHTML = '';
  wallpaperElement.style.backgroundColor = photo.averageColor();

  const height = window.innerHeight;
  const width = window.innerWidth;
  const tinyImage = new Image(width, height);
  tinyImage.src = photo.tinyUrl();
  wallpaperElement.appendChild(tinyImage);

  fromEvent(tinyImage, 'load')
    .pipe(first(), takeUntil(destroy$))
    .subscribe(() => {
      tinyImage.style.opacity = '1';

      const largeImage = new Image(width, height);
      largeImage.src = photo.largeUrl();
      wallpaperElement.appendChild(largeImage);

      fromEvent(largeImage, 'load')
        .pipe(first(), takeUntil(destroy$))
        .subscribe(() => largeImage.style.opacity = '1');
    });
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

  return data.photos[(max => Math.floor(Math.random() * max))(data.photos.length)];
}

export default async function createWallpaperElement<T>(photoService: PhotoService<T>) {
  const { destroy$, init$, input$ } = await createCustomElement({
    selector: 'pen-wallpaper',
    attributes: ['search']
  });

  init$.subscribe(htmlElement => {
    const shadowRoot = htmlElement.shadowRoot!;

    attachStyle(shadowRoot, styleString);

    input$.subscribe(async data => {
      const { attribute, newValue } = data;

      if (attribute === 'search' && newValue) {
        const searchQuery = fetchInput(htmlElement, newValue);
        const photo = await search(photoService, searchQuery);

        if (photo) {
          const inputs = injectChildrenInputs(shadowRoot, { photographer: photo.photographer() });
          attachTemplate(shadowRoot, template(inputs));
          updateWallpaper(shadowRoot, photo, destroy$);
        }
      }
    });
  });
}
