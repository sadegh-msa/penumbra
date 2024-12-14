import { PexelsResponse } from '@models/pexels-response.model';
import './styles/main.scss';

(async () => {
  try {
    (await import('@app/elements/icon/icon.element')).createIconElement();
    (await import('@app/elements/paginator/paginator.element')).createPaginatorElement();
    const { pexelsPhotoSource } = (await import('@app/photo-sources/pexels'));
    const photoService = new (await import('@services/photo.service')).PhotoService<PexelsResponse>(pexelsPhotoSource);
    (await import('@app/elements/wallpaper/wallpaper.element')).createWallpaperElement(photoService);
    (await import('@app/elements/app/app.element')).createAppElement();
  } catch (error) {
    console.error(error);
  }
})();
