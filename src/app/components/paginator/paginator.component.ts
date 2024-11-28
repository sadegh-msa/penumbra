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
  #photographer: Photographer;
  #photographerElement: HTMLAnchorElement;
  #photographerNameElement: HTMLSpanElement;

  shadowRoot: ShadowRoot;

  get photographerElement() {
    this.#photographerElement ??= this.shadowRoot
      .getElementById('fcPaginatorPhotographer') as HTMLAnchorElement;

    return this.#photographerElement;
  }

  get photographerNameElement() {
    this.#photographerNameElement ??= this.photographerElement
      ?.getElementsByClassName('fc-paginator-photographer-name')[0] as HTMLSpanElement;

    return this.#photographerNameElement;
  }

  @Input()
  set photographer(photographer: Photographer) {
    this.#photographer = photographer;
    this.updatePhotographer();
  }

  get photographer() {
    return this.#photographer;
  }

  constructor() {
    undefined;
  }

  fcOnInit(): void {
    undefined;
  }

  updatePhotographer() {
    this.photographerElement.href = this.photographer.url;
    this.photographerNameElement.innerText = this.photographer.name;
    this.photographerNameElement.title = `Photographer: ${this.photographer.name}`;
  }

}

