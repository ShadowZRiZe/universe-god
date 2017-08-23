// import Resource from './resource';
import { Resource } from './resources/';

module.exports = (game) => {
  let resourceTable = {};

  resourceTable['mass'] = new Resource({
    game: game,
    name: 'mass',
    suffix: 'kg',
    holderID: 'overview-container',
    dependent: false,
    visible: true,
    amount: 10
  });

  resourceTable['water'] = new Resource({
    game: game,
    name: 'water',
    suffix: 'L',
    dependent: true,
    cost: { hydrogen: 2, oxygen: 1 },
    visible: true,
    amount: 0
  });

  resourceTable['oxygen'] = new Resource({
    game: game,
    name: 'oxygen',
    dependent: false,
    visible: true,
    amount: 0
  });

  resourceTable['hydrogen'] = new Resource({
    game: game,
    name: 'hydrogen',
    dependent: false,
    visible: true,
    amount: 0
  });

  resourceTable['helium'] = new Resource({
    game: game,
    name: 'helium',
    dependent: false,
    visible: true,
    amount: 0
  });

  resourceTable['dinitrogen'] = new Resource({
    game: game,
    name: 'dinitrogen',
    dependent: false,
    visible: true,
    amount: 0
  });

  resourceTable['argon'] = new Resource({
    game: game,
    name: 'argon',
    dependent: false,
    visible: true,
    amount: 0
  });

  return resourceTable;
};
