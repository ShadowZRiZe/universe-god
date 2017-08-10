import Generator from './generator';

module.exports = (game) => {
  let generatorTable = {};

  // Mass generators
  generatorTable['mass-1'] = new Generator({
    game: game,
    name: 'Massgen 1',
    buttonID: 'btn-mass-1',
    category: 'mass',
    visible: true,
    income: { mass: 6 },
    cost: { mass: 10 },
    inflation: 1.15,
    time: 3,
    level: 0,
    levelCost: 500,
    levelEffect: 2,
    successEffect: 2,
    owned: 0
  });

  generatorTable['mass-2'] = new Generator({
    game: game,
    name: 'Massgen 2',
    buttonID: 'btn-mass-2',
    category: 'mass',
    visible: true,
    income: { mass: 40 },
    cost: { mass: 760 },
    inflation: 1.15,
    time: 6,
    level: 0,
    levelCost: 1750,
    levelEffect: 2,
    successEffect: 2,
    owned: 0
  });

  generatorTable['mass-3'] = new Generator({
    game: game,
    name: 'Massgen 3',
    buttonID: 'btn-mass-3',
    category: 'mass',
    visible: true,
    income: { mass: 660 },
    cost: { mass: 9420 },
    inflation: 1.15,
    time: 12,
    level: 0,
    levelCost: 22500,
    levelEffect: 2,
    successEffect: 2,
    owned: 0
  });
  
  generatorTable['mass-4'] = new Generator({
    game: game,
    name: 'Massgen 4',
    buttonID: 'btn-mass-4',
    category: 'mass',
    visible: true,
    income: { mass: 24400 },
    cost: { mass: 420770 },
    inflation: 1.15,
    time: 24,
    level: 0,
    levelCost: 1250000,
    levelEffect: 2,
    successEffect: 2,
    owned: 0
  });
  
  generatorTable['mass-5'] = new Generator({
    game: game,
    name: 'Massgen 5',
    buttonID: 'btn-mass-5',
    category: 'mass',
    visible: true,
    income: { mass: 469000 },
    cost: { mass: 5333000 },
    inflation: 1.15,
    time: 96,
    level: 0,
    levelCost: 50000000,
    levelEffect: 2,
    successEffect: 2,
    owned: 0
  });

  // Atoms generators
  generatorTable['oxygen-1'] = new Generator({
    game: game,
    name: 'Oxygener',
    buttonID: 'btn-oxygen-1',
    category: 'atom',
    visible: true,
    income: { oxygen: 1 },
    cost: { mass: 200 },
    inflation: 1.25,
    time: 60,
    level: 0,
    levelCost: 250e3,
    levelEffect: 3,
    successEffect: 3,
    owned: 0
  });

  generatorTable['hydrogen-1'] = new Generator({
    game: game,
    name: 'Hydrogener',
    buttonID: 'btn-hydrogen-1',
    category: 'atom',
    visible: true,
    income: { hydrogen: 1 },
    cost: { mass: 200 },
    inflation: 1.25,
    time: 60,
    level: 0,
    levelCost: 250e3,
    levelEffect: 3,
    successEffect: 3,
    owned: 0
  });
  
  generatorTable['helium-1'] = new Generator({
    game: game,
    name: 'Heliumizer',
    buttonID: 'btn-helium-1',
    category: 'atom',
    visible: true,
    income: { helium: 1 },
    cost: { mass: 200 },
    inflation: 1.25,
    time: 60,
    level: 0,
    levelCost: 250e3,
    levelEffect: 3,
    successEffect: 3,
    owned: 0
  });

  // Elements generators
  generatorTable['water-1'] = new Generator({
    game: game,
    name: 'Watergen',
    buttonID: 'btn-water-1',
    category: 'atom',
    visible: true,
    income: { water: 1 },
    cost: { mass: 7500 },
    inflation: 1.25,
    time: 15,
    level: 0,
    levelCost: 1e6,
    levelEffect: 3,
    successEffect: 2,
    owned: 0
  });

  return generatorTable;
};
