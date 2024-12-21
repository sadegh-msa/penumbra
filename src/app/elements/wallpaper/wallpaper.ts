import { attachStyle, attachTemplate, fetchInput, injectChildrenInputs } from '@app/utils/custom-element.utils';
import { compileTemplate } from '@app/utils/template.utils';
import type { Photo, PhotoService } from '@models/photo.model';
import { BehaviorSubject, filter, first, fromEvent, type Observable, Subject, takeUntil } from 'rxjs';
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
  const SELECTOR = 'pen-wallpaper';

  return new Promise(resolve => {
    customElements.whenDefined(SELECTOR).then(resolve);
    customElements.define(
      SELECTOR,
      class extends HTMLElement {
        declare shadowRoot: ShadowRoot;
        static observedAttributes = ['search'];
        readonly init$ = new BehaviorSubject<boolean>(false);
        readonly destroy$ = new Subject<void>();

        constructor() {
          super();

          const internals = this.attachInternals();

          if (!internals.shadowRoot) {
            this.attachShadow({ mode: 'open' });
          }
        }

        connectedCallback() {
          attachStyle(this.shadowRoot, styleString);
          this.init$.next(true);
        }

        disconnectedCallback() {
          this.destroy$.next();
          this.destroy$.unsubscribe();
        }

        attributeChangedCallback(attribute: string, oldValue: string, newValue: string) {
          this.init$.pipe(filter(v => v), takeUntil(this.destroy$))
            .subscribe(async () => {
              if (attribute === 'search' && newValue) {
                const searchQuery = fetchInput(this, newValue);
                const photo = await search(photoService, searchQuery);

                if (photo) {
                  const inputs = injectChildrenInputs(this.shadowRoot, { photographer: photo.photographer() });
                  attachTemplate(this.shadowRoot, template(inputs));
                  updateWallpaper(this.shadowRoot, photo, this.destroy$);
                }
              }
            });
        }
      }
    );
  });
}
