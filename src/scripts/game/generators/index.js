import $ from 'jquery';

import { format } from '../../formatter/index';

import { template } from './template';
import { timemult, incomemult } from './mults';
import { cost } from './cost';

class Generator {
  constructor(opt) {
    // Reference to the Game class
    this.game = opt.game;

    this.category = opt.category;

    this.id = opt.id;
    this.name = opt.name;

    this.income = opt.income;

    this.cost = opt.cost;
    this.inflation = 1.15;

    this.time = opt.time;
    this.paused = false;

    this.owned = opt.owned || 0;
    this.progression = 0;

    this.elementID = `gen-${this.id}`;
    this.statsID = this.elementID + '-stats';
    this.pauseID = this.elementID + '-pause';
    this.sellID = this.elementID + '-sell';
    this.upgradeID = this.elementID + '-upgrade';
    this.successID = this.successID + '-success';
    this.barID = this.successID + '-bar';
  }

  sufficient() {
    let sufficient = [],
      prices = cost(this);

    for (let [index, value] of prices) {
      let res = this.game.resourceTable[index];

      res.amount >= value ? sufficient.push(true) : sufficient.push(false);
    }

    return sufficient.every(el => el === true);
  }

  progress(times) {
    let time = this.time / timemult(this);

    if (this.owned > 0 && !this.paused) {
      this.progression += times / this.game.options.fps;
    }

    if (this.progression >= time) {
      this.process();
    }
  }

  process() {
    this.progression = 0;

    for (let [index, value] of Object.entries(this.income)) {
      let res = this.game.resourceTable[index],
        income = (value * this.owned) * incomemult(this);

      res.earn(this.owned, income);
    }
  }

  render() {}

  init() {}
}

export { Generator };
