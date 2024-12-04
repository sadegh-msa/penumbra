import { AppComponent } from '@app/app.component';
import { pexelsPhotoSource } from '@app/photo-sources/pexels';
import { IconComponent } from '@components/icon/icon.component';
import { PaginatorComponent } from '@components/paginator/paginator.component';
import { WallpaperComponent } from '@components/wallpaper/wallpaper.component';
import { PexelsResponse } from '@models/pexels-response.model';
import { PhotoService } from '@services/photo.service';


(async () => {
  try {
    const styles = (await import('./styles.scss')).default;
    styles.use({ target: document.getElementsByTagName('head')[0] });

    new IconComponent();
    new PaginatorComponent();
    new WallpaperComponent<PexelsResponse>(new PhotoService<PexelsResponse>(pexelsPhotoSource));
    new AppComponent();
  } catch (error) {
    console.error(error);
  }
})();
