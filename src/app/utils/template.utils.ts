import Handlebars from 'handlebars';

Handlebars.registerHelper('css_photographer', function () {
  return 'flex'
})

export function compileTemplate(templateString: string) {
  return Handlebars.compile(templateString);
}
