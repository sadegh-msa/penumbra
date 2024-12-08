import { Component } from '@decorators/component.decorator';
import { Input } from '@decorators/input.decorator';
import { OnInit } from '@interfaces/component.interface';
import style from './icon.component.scss?inline';


@Component({
  selector: 'fc-icon',
  style
})
export class IconComponent implements OnInit {
  declare shadowRoot: ShadowRoot;

  @Input()
  set icon(icon: string) {
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

  fcOnInit() {
    undefined;
  }

  getIconUrl(icon: string) {
    return `icons/${icon}.svg`;
  }
}

