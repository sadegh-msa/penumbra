import { PexelsResponse } from '@models/pexels-response.model';
import './styles/main.scss';

(async () => {
  try {
    const { pexelsPhotoSource } = (await import('@app/photo-sources/pexels'));
    const photoService = new (await import('@services/photo.service')).PhotoService<PexelsResponse>(pexelsPhotoSource);

    (await import('@app/elements/icon/icon.element')).default().then();
    (await import('@app/elements/paginator/paginator.element')).default().then();
    (await import('@app/elements/wallpaper/wallpaper.element')).default(photoService).then();
    (await import('@app/elements/app/app.element')).default().then();
  } catch (error) {
    console.error(error);
  }
})();
