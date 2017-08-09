import Resource from './resource';

module.exports = (game) => {
  let resourceTable = {};

  resourceTable['mass'] = new Resource({
    game: game,
    name: 'mass',
    suffix: 'kg',
    resourceHolder: 'holder-mass',
    resourceID: 'display-mass',
    resourceContainer: 'resources-container',
    independant: true,
    visible: true,
    amount: 10
  });
  
  resourceTable['water'] = new Resource({
    game: game,
    name: 'water',
    suffix: 'L',
    resourceHolder: 'holder-water',
    resourceID: 'display-water',
    resourceContainer: 'resources-container',
    independant: false,
    cost: { hydrogen: 2, oxygen: 1 },
    visible: true,
    amount: 0
  });

  resourceTable['oxygen'] = new Resource({
    game: game,
    name: 'oxygen',
    resourceHolder: 'holder-oxygen',
    resourceID: 'display-oxygen',
    resourceContainer: 'resources-container',
    independant: true,
    visible: true,
    amount: 0
  });

  resourceTable['hydrogen'] = new Resource({
    game: game,
    name: 'hydrogen',
    resourceHolder: 'holder-hydrogen',
    resourceID: 'display-hydrogen',
    resourceContainer: 'resources-container',
    independant: true,
    visible: true,
    amount: 0
  });
  
  resourceTable['helium'] = new Resource({
    game: game,
    name: 'helium',
    resourceHolder: 'holder-helium',
    resourceID: 'display-helium',
    resourceContainer: 'resources-container',
    independant: true,
    visible: true,
    amount: 0
  });

  return resourceTable;
};
