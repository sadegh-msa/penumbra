function paginatorTemplate(params: any) {
  return `
  <a class="pen-paginator-photographer"
     href="${params.photographer.url}"
     title="Photographer: ${params.photographer.name}">
    <pen-icon icon="outline/camera"></pen-icon>
    <span class="pen-paginator-photographer-name">
      ${params.photographer.name}
    </span>
  </a>
`;
}

export default paginatorTemplate;
