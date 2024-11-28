let instance: SvgIconsService;

export class SvgIconsService {
  readonly #icons = new Map<string, Promise<string>>();

  static get instance() {
    return instance || (instance = new SvgIconsService());
  }

  async registerIcons(icons: Map<string, string>): Promise<void> {
    try {
      const iterator = icons.entries();
      let [icon, url] = iterator.next().value;

      while (icon) {
        this.#icons.set(icon, fetch(url).then(r => r.text()));
        [icon, url] = iterator.next().value;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async loadIcons(dom?: Element): Promise<void> {
    if (!dom) {
      return;
    }

    try {
      const iterator = this.#icons.entries();
      let [icon, request] = iterator.next().value;

      while (icon) {
        const elements = dom.getElementsByClassName(`icon ${icon}`);
        const elementsLength = elements.length;

        if (elementsLength) {
          const svg = await request;

          for (let i = 0; i < elementsLength; i++) {
            elements[i].innerHTML = svg || '';
          }
        }

        [icon, request] = iterator.next().value;
      }
    } catch (error) {
      console.error(error);
    }
  }
}
