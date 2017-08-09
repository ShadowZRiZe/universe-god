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
  
  itemTable['vegetation'] = new Item({
    game: game,
    name: 'Vegetation',
    desc: 'Maintain a stable level of vegetation to create cells.',
    buttonID: 'btn-vegetation',
    category: 'planet',
    cost: { oxygen: 25e3, helium: 17.5e3 },
    visible: true,
    owned: false
  });
  
  return itemTable;
};