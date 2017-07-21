const Resource = require('./resource');

module.exports = (game) => {
  let resourceTable = {};

  resourceTable['mass'] = new Resource({
    game: game,
    name: 'mass',
    suffix: 'kg',
    resourceID: 'display-mass',
    resourceContainer: 'overview-container',
    independant: true,
    income: { mass: 10 },
    amount: 10
  });

  resourceTable['oxygen'] = new Resource({
    game: game,
    name: 'oxygen',
    resourceID: 'display-oxygen',
    resourceContainer: 'resources-container',
    imgPath: 'atoms/oxygen.svg',
    independant: true
  });

  resourceTable['hydrogen'] = new Resource({
    game: game,
    name: 'hydrogen',
    resourceID: 'display-hydrogen',
    resourceContainer: 'resources-container',
    imgPath: 'atoms/hydrogen.svg',
    independant: true
  });

  resourceTable['water'] = new Resource({
    game: game,
    name: 'water',
    suffix: 'L',
    resourceID: 'display-water',
    resourceContainer: 'resources-container',
    imgPath: 'atoms/water.svg',
    independant: false
  });

  return resourceTable;
};
