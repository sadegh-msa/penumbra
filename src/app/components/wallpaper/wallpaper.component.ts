import { Component } from '@decorators/component.decorator';
import { Input } from '@decorators/input.decorator';
import { OnInit } from '@interfaces/component.interface';
import { Photo } from '@models/photo.model';
import { PhotoService } from '@services/photo.service';
import template from './wallpaper.component.html?raw';
import style from './wallpaper.component.scss?inline';


@Component({
  selector: 'fc-wallpaper',
  template,
  style
})
export class WallpaperComponent<T> implements OnInit {
  #styleElement: HTMLStyleElement;
  #paginatorElement: HTMLElement;
  #photoService: PhotoService<T>;

  declare shadowRoot: ShadowRoot;

  get styleElement() {
    this.#styleElement ??= this.shadowRoot.lastChild as HTMLStyleElement;

    return this.#styleElement;
  }

  get paginatorElement() {
    this.#paginatorElement ??= this.shadowRoot
      .getElementById('fcWallpaperPaginator') as HTMLElement;

    return this.#paginatorElement;
  }

  @Input()
  set search(query: string) {
    this.#photoService.photoSource.params.query = query;
    this.#photoService.photoSource.params.page = 10;
    // this.photoService.photoSource.params.page = Math.floor(Math.random() * 80);

    this.#photoService.loadPhotos().then(data => {
      if (!data?.photos?.length) {
        this.#photoService.clearCache();
        return;
      }

      const photo = data.photos[((max) => Math.floor(Math.random() * max))(data.photos.length)];
      this.paginatorElement.setAttribute('photographer', JSON.stringify(photo.photographer()));
      this.updateBackground(photo);
    });
  }

  constructor(photoService: PhotoService<T>) {
    this.#photoService = photoService;
  }

  fcOnInit(): void {
    undefined;
  }

  updateBackground(photo: Photo) {
    this.styleElement.innerHTML = `
      :host {
        .fc-wallpaper-photo::before {
          background-image: url(${photo.tinySize()});
        }

        .fc-wallpaper-photo::after {
          background-image: url(${photo.largeSize()});
        }
      }
    `;
  }
}

