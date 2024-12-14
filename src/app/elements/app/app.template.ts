export default function appTemplate(shadowRoot: ShadowRoot, params: { search: string }) {
  const searchKey = window.crypto.randomUUID();
  shadowRoot.getRootNode().host['penInputs'] = {
    [searchKey]: params.search
  };

  return `
  <div class="app-container">
    <div class="app-wallpaper">
      <pen-wallpaper search="${searchKey}"></pen-wallpaper>
    </div>
  </div>
  `;
}
