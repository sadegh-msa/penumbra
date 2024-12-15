import Handlebars from 'handlebars';

export function compileTemplate(templateString: string) {
  return Handlebars.compile(templateString);
}
