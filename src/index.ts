import type { PexelsResponse } from '@models/pexels-response.model';
import './styles/main.scss';

(async () => {
  try {
    const pexelsPhotoSource = (await import('@app/photo-sources/pexels')).default;
    const photoService = new (await import('@services/photo.service'))
      .default<PexelsResponse>(pexelsPhotoSource);

    (await import('@elements/icon/icon')).default().then();
    (await import('@elements/paginator/paginator')).default().then();
    (await import('@elements/wallpaper/wallpaper')).default(photoService).then();
    (await import('@elements/app/app')).default().then();
  } catch (error) {
    console.error(error);
  }
})();
