import { Component } from '@decorators/component.decorator';
import { Input } from '@decorators/input.decorator';
import { OnInit } from '@interfaces/component.interface';
import { Photographer } from '@models/photographer.model';


@Component({
  selector: 'fc-paginator',
  template: import('./paginator.component.html'),
  style: import('./paginator.component.scss')
})
export class PaginatorComponent implements OnInit {
  private myPhotographer: Photographer;
  private myPhotographerElement: HTMLAnchorElement;
  private myPhotographerNameElement: HTMLSpanElement;

  shadowRoot: ShadowRoot;

  get photographerElement(): HTMLAnchorElement {
    this.myPhotographerElement ??= this.shadowRoot
      .getElementById('fcPaginatorPhotographer') as HTMLAnchorElement;

    return this.myPhotographerElement;
  }

  get photographerNameElement(): HTMLSpanElement {
      this.myPhotographerNameElement ??= this.photographerElement
        ?.getElementsByClassName('fc-paginator-photographer-name')[0] as HTMLSpanElement;

    return this.myPhotographerNameElement;
  }

  @Input()
  set photographer(photographer: Photographer) {
    this.myPhotographer = photographer;
    this.updatePhotographer();
  }
  get photographer(): Photographer {
    return this.myPhotographer;
  }

  constructor() {
    undefined;
  }

  fcOnInit(): void {
    undefined;
  }

  updatePhotographer(): void {
    this.photographerElement.href = this.photographer.url;
    this.photographerNameElement.innerText = this.photographer.name;
    this.photographerNameElement.title = `Photographer: ${this.photographer.name}`;
  }

}

