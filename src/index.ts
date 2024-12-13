import { PexelsResponse } from '@models/pexels-response.model';
import './styles/main.scss';

(async () => {
  try {
    new (await import('@components/icon/icon.component')).IconComponent();
    new (await import('@components/paginator/paginator.component')).PaginatorComponent();
    const { pexelsPhotoSource } = (await import('@app/photo-sources/pexels'));
    const photoService = new (await import('@services/photo.service')).PhotoService<PexelsResponse>(pexelsPhotoSource);
    new (await import('@components/wallpaper/wallpaper.component')).WallpaperComponent<PexelsResponse>(photoService);
    new (await import('@components/app/app.component')).AppComponent;
  } catch (error) {
    console.error(error);
  }
})();
