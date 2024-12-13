import { Component } from '@decorators/component.decorator';
import { Input } from '@decorators/component-input.decorator';
import { ComponentEssentials } from '@models/component.model';
import style from './icon.component.scss?inline';


@Component({
  selector: 'pen-icon',
  style
})
export class IconComponent implements ComponentEssentials {
  declare shadowRoot: ShadowRoot;

  @Input()
  set icon(icon: string) {
    if ([...this.shadowRoot.childNodes].map(i => i.nodeName).includes('svg')) {
      return;
    }

    fetch(this.getIconUrl(icon)).then(response => {
      (async () => {
        const wrapperElement = document.createElement('div');
        wrapperElement.innerHTML = await response.text();
        const svgElement = wrapperElement.firstChild as SVGElement;
        svgElement.setAttribute('part', 'svg');

        if (svgElement) {
          this.shadowRoot.appendChild(svgElement);
        }
      })();
    });
  }

  onInit() {
  }

  getIconUrl(icon: string) {
    return `icons/${icon}.svg`;
  }
}

