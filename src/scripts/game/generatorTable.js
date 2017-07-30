const Generator = require('./generator');

module.exports = (game) => {
  let generatorTable = {};

  generatorTable['mass-1'] = new Generator({
    game: game,
    name: 'Generator 1',
    buttonID: 'btn-mass-1',
    barID: 'btn-mass-1-bar',
    statsID: 'btn-mass-1-stats',
    pauseID: 'btn-mass-1-pause',
    category: 'mass',
    visible: true,
    income: { mass: 6 },
    price: { mass: 10 },
    inflation: 1.15,
    time: 3,
    owned: 0
  });

  generatorTable['mass-2'] = new Generator({
    game: game,
    name: 'Generator 2',
    buttonID: 'btn-mass-2',
    barID: 'btn-mass-2-bar',
    statsID: 'btn-mass-2-stats',
    pauseID: 'btn-mass-2-pause',
    category: 'mass',
    visible: true,
    income: { mass: 40 },
    price: { mass: 160 },
    inflation: 1.13,
    time: 7,
    owned: 0
  });

  generatorTable['mass-3'] = new Generator({
    game: game,
    name: 'Generator 3',
    buttonID: 'btn-mass-3',
    barID: 'btn-mass-3-bar',
    statsID: 'btn-mass-3-stats',
    pauseID: 'btn-mass-3-pause',
    category: 'mass',
    visible: true,
    income: { mass: 420 },
    price: { mass: 2600 },
    inflation: 1.11,
    time: 14,
    owned: 0
  });

  generatorTable['oxygen-1'] = new Generator({
    game: game,
    name: 'Oxygener',
    buttonID: 'btn-oxygen-1',
    barID: 'btn-oxygen-1-bar',
    statsID: 'btn-oxygen-1-stats',
    pauseID: 'btn-oxygen-1-pause',
    category: 'atom',
    visible: true,
    income: { oxygen: 1 },
    price: { mass: 200 },
    inflation: 1.25,
    time: 60,
    owned: 0
  });

  generatorTable['hydrogen-1'] = new Generator({
    game: game,
    name: 'Hydrogener',
    buttonID: 'btn-hydrogen-1',
    barID: 'btn-hydrogen-1-bar',
    statsID: 'btn-hydrogen-1-stats',
    pauseID: 'btn-hydrogen-1-pause',
    category: 'atom',
    visible: true,
    income: { hydrogen: 1 },
    price: { mass: 200 },
    inflation: 1.25,
    time: 60,
    owned: 0
  });

  return generatorTable;
};
