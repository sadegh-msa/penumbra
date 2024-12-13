import { Component } from '@decorators/component.decorator';
import { Input } from '@decorators/component-input.decorator';
import { ComponentEssentials } from '@models/component.model';
import { Photographer } from '@models/photographer.model';
import style from './paginator.style.scss?inline';
import template from './paginator.template';

@Component({
  selector: 'pen-paginator',
  template,
  style
})
export class PaginatorComponent implements ComponentEssentials {
  #photographer: Photographer;

  declare shadowRoot: ShadowRoot;

  @Input()
  set photographer(photographer: Photographer) {
    this.#photographer = photographer;
  }

  get photographer() {
    return this.#photographer;
  }

  onInit() {
  }
}

