import { Component } from '@decorators/component.decorator';
import { Input } from '@decorators/component-input.decorator';
import { ComponentEssentials } from '@models/component.model';
import { Photo } from '@models/photo.model';
import { PhotoService } from '@services/photo.service';
import style from './wallpaper.style.scss?inline';
import template from './wallpaper.template';


@Component({
  selector: 'pen-wallpaper',
  template,
  style
})
export class WallpaperComponent<T> implements ComponentEssentials {
  #styleElement: HTMLStyleElement;
  #photoService: PhotoService<T>;

  declare shadowRoot: ShadowRoot;
  photo: Photo;

  get styleElement() {
    this.#styleElement ??= this.shadowRoot.lastChild as HTMLStyleElement;

    return this.#styleElement;
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

      this.photo = data.photos[((max) => Math.floor(Math.random() * max))(data.photos.length)];
      this.updateBackground();
    });
  }

  constructor(photoService: PhotoService<T>) {
    this.#photoService = photoService;
  }

  onInit() {
  }

  updateBackground() {
    this.styleElement.innerHTML = `
      :host {
        .pen-wallpaper-photo::before {
          background-image: url(${this.photo.tinySize()});
        }

        .pen-wallpaper-photo::after {
          background-image: url(${this.photo.largeSize()});
        }
      }
    `;
  }
}

