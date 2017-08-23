import $ from 'jquery';

import { format } from '../../formatter/';
import { template } from './template';
import { tooltip } from './tooltip';
import { visibility } from './visibility';

class Resource {
  constructor(opt) {
    // Reference to the Game class
    this.game = opt.game;

    this.name = opt.name;

    // If the resource is dependent from other resources
    this.dependent = opt.dependent;

    this.cost = opt.cost;
    this.amount = opt.amount || 0;
    this.totalAmount = opt.totalAmount || 0;

    // If the resource have a suffix to display like 'kg' or 'mL'
    this.suffix = opt.suffix || false;

    this.visible = opt.visible || false;

    this.holderID = opt.holderID || 'resources-container';
    this.containerID = `container-res-${this.name}`;
    this.elementID = `res-${this.name}`;
  }

  sufficient(amount) {
    let sufficient = [];

    for (let [index, value] of Object.entries(this.cost)) {
      let res = this.game.resourceTable[index],
        cost = value * amount;

      res.amount >= cost ? sufficient.push(true) : sufficient.push(false);
    }

    return sufficient.every(el => el === true);
  }

  earn(amount, income) {
    if (!this.dependent) {
      this.amount += income;
      this.totalAmount += income;
    }
    else if (this.sufficient(amount)) {
      for (let [index, value] of Object.entries(this.cost)) {
        let res = this.game.resourceTable[index],
          cost = value * amount;

        res.amount -= cost;
      }

      this.amount += income;
    }
  }

  render(times) {
    if (this.suffix) {
      $(`#${this.elementID}`).html(format(this.amount, 2, this.suffix));
    }
    else {
      $(`#${this.elementID}`).html(format(this.amount, 2));
    }
  }

  init() {
    $(`#${this.holderID}`).append(template(this));
    $(`#${this.containerID}`).attr('data-tooltip', tooltip(this));

    if (!this.visible) {
      $(`#${this.containerID}`).hide();
    }
  }
}

export { Resource };
