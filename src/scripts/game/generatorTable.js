// import Generator from './generator';
import { Generator } from './generators/';

module.exports = (game) => {
  let generatorTable = {};

  generatorTable['mass-1'] = new Generator({
    game: game,
    category: 'mass',
    id: 'mass-1',
    name: 'Massgen 1',
    income: { mass: 1 },
    cost: { mass: 4 },
    time: 3,
    owned: 5
  });

  return generatorTable;
};
