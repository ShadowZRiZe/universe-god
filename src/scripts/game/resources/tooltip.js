import $ from 'jquery';

function tooltip(Resource) {
  if (Resource.dependent) {
    let cost = [];

    for (let [index, value] of Object.entries(Resource.cost)) {
      cost.push(`-${value} ${index}`);
    }

    return cost.join(', ');
  }
}

export { tooltip };
