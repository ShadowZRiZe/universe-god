import $ from 'jquery';

import { format } from './../formatter/index';

class Generator {
  constructor(opt) {
    this.game = opt.game;
    this.name = opt.name;
    this.category = opt.category;
    this.income = opt.income;
    this.cost = opt.cost;
    this.time = opt.time;

    this.inflation = opt.inflation || 1.15;
    this.owned = opt.owned || 0;
    this.progression = 0;

    this.successEffect = opt.successEffect;
    this.milestones = [10, 25, 50, 75, 100, 150, 200, 300, 400, 500, 600, 666, 700, 777, 800, 900, 1000];

    this.level = opt.level || 0;
    this.levelCost = opt.levelCost;
    this.levelEffect = opt.levelEffect;
    this.levelInflation = 5;

    this.buttonID = opt.buttonID || undefined;
    this.barID = this.buttonID + '-bar';
    this.statsID = this.buttonID + '-stats';
    this.pauseID = this.buttonID + '-pause';
    this.sellID = this.buttonID + '-sell';
    this.upgradeID = this.buttonID + '-upgrade';
    this.successID = this.buttonID + '-success';

    this.visible = opt.visible || false;
    this.paused = opt.paused || false;
  }

  getSuccessPlace() {
    let milestone = -1;

    for (let i = 0; i < this.milestones.length; i++) {
      if (this.owned >= this.milestones[i] && this.owned < this.milestones[i + 1]) {
        milestone = i;
      }
    }

    return milestone + 1;
  }

  getTimeMult() {
    if (this.getSuccessPlace() < 1) {
      return 1;
    }
    else {
      return this.getSuccessPlace() * this.successEffect;
    }
  }

  getUpgradeMult() {
    if (this.level < 1) {
      return 1;
    }
    else {
      return this.level * this.levelEffect;
    }
  }

  // done
  sufficient() {
    let sufficient = [];

    for (let key in this.cost) {
      let res = this.game.resourceTable[key],
        cost = Math.floor(this.cost[key] * Math.pow(this.inflation, this.owned));

      (res.amount >= cost) ? sufficient.push(true) : sufficient.push(false);
    }

    return sufficient.every((el) => el === true);
  }

  infos() {
    let income = [],
      cost = [];

    for (let key in this.income) {
      let res = this.game.resourceTable[key],
        baseIncome = this.income[key] * this.getUpgradeMult();

      income.push(`+${format(baseIncome)} ${res.name}`);
    }

    for (let key in this.cost) {
      let res = this.game.resourceTable[key],
        price = Math.floor(this.cost[key] * Math.pow(this.inflation, this.owned));

      cost.push(`-${format(price)} ${res.name}`);
    }

    return {
      income: income,
      cost: cost
    };
  }

  upgrade() {
    let cost = Math.floor(this.levelCost * Math.pow(this.levelInflation, this.level + 1));

    if (this.game.resourceTable.mass.amount >= cost) {
      this.game.resourceTable.mass.amount -= cost;
      this.level++;
      this.render(true);
    }
  }

  buy() {
    if (this.sufficient()) {
      for (let key in this.cost) {
        let res = this.game.resourceTable[key],
          cost = Math.floor(this.cost[key] * Math.pow(this.inflation, this.owned));

        res.amount -= cost;
      }

      this.owned++;
      this.render(true);
    }
  }

  sell() {
    if (this.owned > 1) {
      for (let key in this.cost) {
        let res = this.game.resourceTable[key],
          refund = Math.floor(this.cost[key] * Math.pow(this.inflation, this.owned - 1)) * 0.5;

        res.amount += refund;
      }

      this.owned--;
      this.render(true);
    }
  }

  pause() {
    this.paused = !this.paused;

    if (this.paused)
      $(`#${this.pauseID}`).removeClass('pause').addClass('play');
    else
      $(`#${this.pauseID}`).removeClass('play').addClass('pause');
  }

  visibility(state) {
    this.visible = state;

    (state) ? $(`#${this.buttonID}`).fadeIn() : $(`#${this.buttonID}`).fadeOut();

    this.render();
  }

  process() {
    this.progression = 0;

    for (let key in this.income) {
      let res = this.game.resourceTable[key],
        amount = this.owned,
        income = (this.income[key] * this.getUpgradeMult()) * amount;

      res.earn(this.owned, income);
    }
  }

  // done
  progress(times) {
    let time = this.time / this.getTimeMult();

    if (this.owned > 0 && !this.paused) {
     this.progression += times / this.game.options.fps;
    }

    if (this.progression >= time) {
      this.process();
    }
  }

  text() {
    let cost = this.infos().cost,
      income = this.infos().income,
      time = this.time / this.getTimeMult();

    return `<p><b>${this.name}</b>: ${income}; ${format(time)}s.
      <span>
        ${cost}
        <span class="ui label">${this.owned}</span>
      </span>
    </p>`;
  }

  tooltip() {
    let income = [],
      cost = [],
      milestone = this.getSuccessPlace(),
      time = this.time / this.getTimeMult(),
      upgrade = Math.floor(this.levelCost * Math.pow(this.levelInflation, this.level + 1));

    for (let key in this.income) {
      let res = this.game.resourceTable[key],
        amount = (this.income[key] * this.getUpgradeMult()) * this.owned,
        sec = amount / time;

      income.push(`+${format(amount)} ${res.name} (${format(sec)}/s)`);

      for (let item in res.cost) {
        let amount = res.cost[item] * this.owned;

        cost.push(`-${format(amount)} ${item}`);
      }
    }

    return {
      stats: `${income.join(', ')}; ${cost.join(', ')}`,
      upgrade: `Upgrade: -${format(upgrade)} mass, x${this.levelEffect} base prod.`,
      success: `Success: own ${this.milestones[milestone]} ${this.name}, time /${this.successEffect}.`
    };
  }

  // done
  template() {
    return `
    <div id="${this.buttonID}" class="accordion-button noselect">
      <div class="ui grid grid-accordion">
        <div class="two wide column pause">
          <div>
            <i id="${this.pauseID}" class="pause icon accordion-icon"></i>
          </div>
        </div>
        <div class="one wide column sell">
          <div>
            <i id="${this.sellID}" class="dollar icon accordion-icon"></i>
          </div>
        </div>
        <div class="one wide column upgrade">
          <div>
            <i id="${this.upgradeID}" class="angle double up icon accordion-icon"></i>
          </div>
        </div>
        <div class="one wide column success">
          <div>
            <i id="${this.successID}" class="trophy icon accordion-icon"></i>
          </div>
        </div>
        <div class="eleven wide column buy">
          <p id="${this.statsID}"></p>
        </div>
      </div>

      <div class="bar">
        <div id="${this.barID}" class="filler"></div>
      </div>
    </div>`;
  }

  render(fullRender) {
    let time = this.time / this.getTimeMult(),
      percent = (this.progression / time) * 100,
      tooltip = this.tooltip();

    if (time < .25) {
      $(`#${this.barID}`).width('100%');
    }
    else {
      $(`#${this.barID}`).width(`${percent}%`);
    }

    if (fullRender) {
      $(`#${this.statsID}`).html(this.text()).attr('data-tooltip', tooltip.stats);
      $(`#${this.upgradeID}`).parent().attr('data-tooltip', tooltip.upgrade);
      $(`#${this.successID}`).parent().attr('data-tooltip', tooltip.success);
    }
  }

  init() {
    $(`#content-${this.category}`).append(this.template());
    $(`#${this.pauseID}`).click(() => this.pause());
    $(`#${this.sellID}`).click(() => this.sell());
    $(`#${this.statsID}`).click(() => this.buy());
    $(`#${this.upgradeID}`).click(() => this.upgrade());

    if (!this.visible)
      $(`#${this.buttonID}`).hide();

    this.render(true);
  }
}

module.exports = Generator;
