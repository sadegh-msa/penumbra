import { Component } from '@decorators/component.decorator';
import { Input } from '@decorators/input.decorator';
import { OnInit } from '@interfaces/component.interface';
import { Photo } from '@models/photo.model';
import { PhotoService } from '@services/photo.service';


@Component({
  selector: 'fc-wallpaper',
  template: import('./wallpaper.component.html'),
  style: import('./wallpaper.component.scss')
})
export class WallpaperComponent<T> implements OnInit {
  private myStyleElement: HTMLStyleElement;
  private myPaginatorElement: HTMLElement;

  shadowRoot: ShadowRoot;

  get styleElement(): HTMLStyleElement {
    this.myStyleElement ??= this.shadowRoot.lastChild as HTMLStyleElement;

    return this.myStyleElement;
  }

  get paginatorElement(): HTMLElement {
    this.myPaginatorElement ??= this.shadowRoot
      .getElementById('fcWallpaperPaginator') as HTMLElement;

    return this.myPaginatorElement;
  }

  @Input()
  set search(query: string) {
    this.photoService.photoSource.params.query = query;
    this.photoService.photoSource.params.page = 10;
    // this.photoService.photoSource.params.page = Math.floor(Math.random() * 80);

    this.photoService.loadPhotos().then(data => {
      if (!data?.photos?.length) {
        this.photoService.clearCache();
        return;
      }

      const photo = data.photos[((max) => Math.floor(Math.random() * max))(data.photos.length)];
      this.paginatorElement.setAttribute('photographer', JSON.stringify(photo.photographer()));
      this.updateBackground(photo);
    });
  }

  constructor(private photoService: PhotoService<T>) {
  }

  fcOnInit(): void {
    undefined;
  }

  updateBackground(photo: Photo): void {
    this.styleElement.innerHTML = `
      .fc-wallpaper-photo {
        background-image: url(${photo.tinySize()});
      }

      .fc-wallpaper-photo::after {
        background-image: url(${photo.largeSize()});
        opacity: 1;
      }
    `;
  }
}

