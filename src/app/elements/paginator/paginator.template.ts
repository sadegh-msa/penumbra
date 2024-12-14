import type { Photographer } from '@models/photographer.model';

export default function paginatorTemplate(shadowRoot: ShadowRoot, params: { photographer: Photographer }) {
  const iconKey = window.crypto.randomUUID();
  shadowRoot.getRootNode().host['penInputs'] = {
    [iconKey]: 'outline/camera'
  };

  return `
  <a class="pen-paginator-photographer"
     href="${params.photographer.url}"
     title="Photographer: ${params.photographer.name}">
    <pen-icon id="cameraIcon" icon="${iconKey}"></pen-icon>
    <span class="pen-paginator-photographer-name">
      ${params.photographer.name}
    </span>
  </a>
`;
}
