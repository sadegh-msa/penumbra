import { Component } from '@decorators/component.decorator';
import template from './app.component.html?raw';
import style from './app.component.scss?inline';

@Component({
  selector: 'fc-app',
  template,
  style
})
export class AppComponent {
}

