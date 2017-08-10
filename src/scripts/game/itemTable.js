import Item from './item';

module.exports = (game) => {
  let itemTable = {};
  
  itemTable['sun'] = new Item({
    game: game,
    name: 'Sun',
    desc: 'It will heat your planet and sustain its temperature.',
    buttonID: 'btn-sun',
    category: 'planet',
    cost: { hydrogen: 2500, helium: 1750, oxygen: 1000 },
    visible: true,
    owned: false
  });
  
  itemTable['atmosphere'] = new Item({
    game: game,
    name: 'Atmosphere',
    desc: 'It will protect your planet, especially your future civilization.',
    buttonID: 'btn-atmosphere',
    category: 'planet',
    cost: { dinitrogen: 12000, oxygen: 9000, argon: 3000 },
    visible: true,
    owned: false
  });

  itemTable['vegetation'] = new Item({
    game: game,
    name: 'Vegetation',
    desc: 'Maintain a stable level of vegetation to create cells.',
    buttonID: 'btn-vegetation',
    category: 'planet',
    cost: { helium: 25000, dinitrogen: 17500, argon: 10000 },
    visible: true,
    owned: false
  });
  
  return itemTable;
};