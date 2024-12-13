import { Component } from '@decorators/component.decorator';
import template from './app.template';
import style from './app.style.scss?inline';

@Component({
  selector: 'pen-app',
  template,
  style
})
export class AppComponent {
}

