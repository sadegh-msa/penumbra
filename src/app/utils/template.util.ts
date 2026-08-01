export function createTemplate(templateString: string) {
  return templateString.replace(/{{.*}}/g, '');
}
