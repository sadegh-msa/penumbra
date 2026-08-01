import { attachStyle, attachTemplate, fetchInput, injectChildrenInputs } from '@app/utils/custom-element.util';
import { createTemplate } from '@app/utils/template.util';
import templateString from '@elements/wallpaper/wallpaper.html?raw';
import type { Photo, PhotoStock } from '@models/photo.model';
import type { Photographer } from '@models/photographer.model';
import { BehaviorSubject, filter, first, fromEvent, Subject, skip, takeUntil } from 'rxjs';
import styleString from './wallpaper.scss?inline';

const template = createTemplate(templateString);

export default async function createWallpaperElement(photoStock: PhotoStock) {
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
        readonly photographer$ = new Subject<Photographer>();
        readonly photoIndex$ = new BehaviorSubject<number>(0);
        photos?: Photo[];
        searchQuery = '';
        page = 0;

        constructor() {
          super();

          const internals = this.attachInternals();

          if (!internals.shadowRoot) {
            this.attachShadow({ mode: 'open' });
          }

          let indexModified = false;
          this.photoIndex$
            .pipe(
              takeUntil(this.destroy$),
              skip(1),
              filter(() => {
                const allowed = !indexModified;
                if (indexModified) {
                  indexModified = false;
                }
                return allowed;
              })
            )
            .subscribe(async index => {
              const photosLength = this.photos?.length || 0;

              if (index < 0 || index >= photosLength) {
                let nextIndex = 0;
                let page = this.page;

                if (index < 0) {
                  if (page - 1 < 0) {
                    page = 1;
                  } else {
                    --page;
                  }
                  const perPage = photoStock.getParam('perPage') as number;
                  nextIndex = perPage - 1;
                } else if (index >= photosLength) {
                  ++page;
                }

                try {
                  photoStock.clearCache();
                  this.photos = await this.search(this.searchQuery, page);
                  this.photoIndex$.next(nextIndex);
                } catch (error) {
                  return console.error(error);
                }
                return;
              }

              if (!this.photos) {
                return;
              }

              const photo = this.photos[index];
              this.photographer$.next(photo.photographer());
              this.updateWallpaper(photo);

              if (indexModified) {
                this.photoIndex$.next(index);
              }
            });
        }

        connectedCallback() {
          attachStyle(this.shadowRoot, styleString);
          attachTemplate(this.shadowRoot, template);
          const paginatorElement = this.shadowRoot.querySelector('pen-paginator');

          if (paginatorElement) {
            const inputs = injectChildrenInputs(this.shadowRoot, {
              photographer: this.photographer$,
              photoIndex: this.photoIndex$
            });

            paginatorElement.setAttribute('photographer', inputs.photographer);
            paginatorElement.setAttribute('photo-index', inputs.photoIndex);
          }

          this.init$.next(true);
        }

        disconnectedCallback() {
          this.destroy$.next();
          this.destroy$.unsubscribe();
        }

        attributeChangedCallback(attribute: string, _oldValue: string, newValue: string) {
          this.init$
            .pipe(
              filter(v => v),
              takeUntil(this.destroy$)
            )
            .subscribe(async () => {
              if (attribute === 'search' && newValue) {
                this.searchQuery = fetchInput(this, newValue);
                this.photoIndex$.next(0);
              }
            });
        }

        updateWallpaper(photo: Photo) {
          const wallpaperElement = this.shadowRoot.getElementById('wallpaper');

          if (!wallpaperElement) {
            return;
          }

          wallpaperElement.innerHTML = '';
          wallpaperElement.style.backgroundColor = photo.averageColor();

          const tinyImage = new Image();
          tinyImage.src = photo.tinyUrl();
          wallpaperElement.appendChild(tinyImage);

          fromEvent(tinyImage, 'load')
            .pipe(first(), takeUntil(this.destroy$))
            .subscribe(() => {
              const rect = tinyImage.getBoundingClientRect();
              const top = (window.innerHeight - rect.height) / 3;

              tinyImage.style.top = `${top}px`;
              tinyImage.style.opacity = '1';

              const largeImage = new Image();
              largeImage.src = photo.largeUrl();
              wallpaperElement.appendChild(largeImage);

              fromEvent(largeImage, 'load')
                .pipe(first(), takeUntil(this.destroy$))
                .subscribe(() => {
                  const rect = largeImage.getBoundingClientRect();
                  const top = (window.innerHeight - rect.height) / 3;

                  largeImage.style.top = `${top}px`;
                  largeImage.style.opacity = '1';
                });
            });
        }

        async search(query: string, page: number) {
          photoStock.query = query;
          photoStock.page = page;

          const photos = await photoStock.loadPhotos();
          this.page = page;

          if (!photos?.length) {
            photoStock.clearCache();
            return;
          }

          return photos;
        }
      }
    );
  });
}
