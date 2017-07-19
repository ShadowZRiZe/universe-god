const Resource = require('./resource');

module.exports = (game) => {
  let resourceTable = {};

  resourceTable['mass'] = new Resource({
    game: game,
    name: 'mass',
    suffix: 'kg',
    resourceID: 'display-mass',
    independant: true,
    income: { mass: 10 },
    amount: 10
  });

  resourceTable['oxygen'] = new Resource({
    game: game,
    name: 'oxygen',
    color: 'primary',
    buttonText: 'Make oxygen',
    triggerID: 'btn-oxygen',
    barID: 'btn-oxygen-bar',
    resourceID: 'display-oxygen',
    independant: true,
    tooltip: true,
    time: 4,
    income: { oxygen: 10 }
  });

  resourceTable['hydrogen'] = new Resource({
    game: game,
    name: 'hydrogen',
    color: 'primary',
    buttonText: 'Make hydrogen',
    triggerID: 'btn-hydrogen',
    barID: 'btn-hydrogen-bar',
    resourceID: 'display-hydrogen',
    independant: true,
    tooltip: true,
    time: 4,
    income: { hydrogen: 12 }
  });

  resourceTable['water'] = new Resource({
    game: game,
    name: 'water',
    color: 'teal',
    buttonText: 'Generate water',
    triggerID: 'btn-water',
    barID: 'btn-water-bar',
    resourceID: 'display-water',
    independant: false,
    tooltip: true,
    time: 1,
    income: { water: 1 },
    cost: { oxygen: 2, hydrogen: 4 }
  });

  return resourceTable;
};
