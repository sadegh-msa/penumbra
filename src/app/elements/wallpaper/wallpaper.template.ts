import type { Photo } from '@models/photo.model';

export default function wallpaperTemplate(shadowRoot: ShadowRoot, params: { photo: Photo }) {
  const photographerKey = window.crypto.randomUUID();
  shadowRoot.getRootNode().host['penInputs'] = {
    [photographerKey]: params.photo.photographer()
  };

  return `
    <div class="pen-wallpaper-photo"></div>
    <pen-paginator photographer='${photographerKey}'></pen-paginator>
`;
}
