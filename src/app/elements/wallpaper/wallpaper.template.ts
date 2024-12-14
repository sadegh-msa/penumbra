function wallpaperTemplate(params: any) {
  const key = window.crypto.randomUUID();
  window['penElements'] = {
    [key]: params.photo.photographer()
  };
  return `
    <div class="pen-wallpaper-photo"></div>
    <pen-paginator photographer='@${key}'></pen-paginator>
`;
}

export default wallpaperTemplate;
