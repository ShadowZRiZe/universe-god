const $ = require('jquery'),
  Format = require('./../util/formatter');

/***
 *  Lifecycle: trigger() -> progress() -> process() -> remove() -> earn()
 ***/

class Resource {
  constructor(opt) {
    this.game = opt.game;
    this.name = opt.name;
    this.income = opt.income;

    this.amount = opt.amount || 0;
    this.independant = opt.independant || false;
    this.tooltip = opt.tooltip || false;
    this.time = opt.time || undefined;
    this.cost = opt.cost || undefined;
    this.suffix = opt.suffix || undefined;
    this.color = opt.color || 'grey';
    this.buttonText = opt.buttonText || undefined;
    this.barID = opt.barID || undefined;
    this.triggerID = opt.triggerID || undefined;
    this.resourceID = opt.resourceID || undefined;

    this.activated = false;
    this.progression = 0;
    this.completed = 0;
  }

  template() {
    return `
    <div class="four wide column">
      <div id="${this.triggerID}" class="ui button fluid ${this.color} progression" data-tooltip="" data-position="top center">
        <p>${this.buttonText}</p>
        <div class="bar">
          <div id="${this.barID}" class="filler"></div>
        </div>
      </div>
    </div>`;
  }

  render() {
    if (this.barID !== undefined) {
      let percent = (this.progression / this.time) * 100;

      $(`#${this.barID}`).width(`${percent}%`);
    }

    if (this.resourceID !== undefined) {
      if (this.suffix !== undefined)
        $(`#${this.resourceID}`).html(`${Format(this.amount, this.suffix)}`);
      else
        $(`#${this.resourceID}`).html(`${Format(this.amount)}`);
    }
  }

  process() {
    (!this.independant) ? this.remove() : this.earn();
  }

  isSufficient() {
    let sufficient = [];

    for (let key in this.cost) {
      let res = this.game.resourceTable[key],
        amount = this.cost[key];

      (res.amount >= amount) ? sufficient.push(true) : sufficient.push(false);
    }

    return sufficient.every((el) => el === true);
  }

  remove() {
    for (let key in this.cost) {
      let res = this.game.resourceTable[key],
        amount = this.cost[key];

      if (res.amount >= amount) {
        res.amount -= amount;
        this.earn();
      }
    }
  }

  earn() {
    for (let key in this.income) {
      let res = this.game.resourceTable[key],
        amount = this.income[key];

      res.amount += amount;
      res.completed++;
    }
  }

  progress(times) {
    if (this.activated)
      this.progression += times / this.game.options.fps;

    if (this.progression >= this.time) {
      this.activated = false;
      this.progression = 0;
      this.process();
    }
  }

  trigger(state) {
    if (!this.independant && !this.isSufficient())
      return;

    this.activated = state || true;
  }

  tooltipster() {
    let income = [],
      cost = [];

    for (let key in this.income) {
      let res = this.game.resourceTable[key],
        amount = this.income[key];

      income.push(`+${Format(amount)} ${res.name}`);
    }

    if (!this.independant) {
      for (let key in this.cost) {
        let res = this.game.resourceTable[key],
          amount = this.cost[key];

        cost.push(`-${Format(amount)} ${res.name}`);
      }

      return `${income.join(', ')}; ${cost.join(', ')}; ${Format(this.time)}s.`;
    }
    else
      return `${income.join(', ')}; ${Format(this.time)}s.`;
  }

  init() {
    if (this.triggerID !== undefined) {
      $('#actions-grid').append(this.template());
      $(`#${this.triggerID}`).unbind('click').click(() => this.trigger(true));
    }

    if (this.tooltip)
      $(`#${this.triggerID}`).attr('data-tooltip', this.tooltipster());
  }
}

module.exports = Resource;
