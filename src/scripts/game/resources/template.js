function template(Resource) {
  let infoIcon = Resource.dependent ? '<i class="info circle icon"></i>' : '';

  return `
    <p id="${Resource.containerID}">
      ${infoIcon} ${Resource.name} <span id="${Resource.elementID}" class="float-right bold"></span>
    </p>
  `;
}

export { template };
