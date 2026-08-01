import './styles/main.scss';

(async () => {
  try {
    const PixabayPhotoStock = (await import('@app/photo-stocks/pixabay/pixabay')).default;
    const photoStock = new PixabayPhotoStock();

    (await import('@elements/icon/icon')).default().then();
    (await import('@elements/paginator/paginator')).default().then();
    (await import('@elements/wallpaper/wallpaper')).default(photoStock).then();
    (await import('@elements/app/app')).default().then();
  } catch (error) {
    console.error(error);
  }
})();
