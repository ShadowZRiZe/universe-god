const $ = require('jquery'),
  Format = require('./../util/formatter');

/***
 *  Lifecycle: progress() -> process() -> earn()
 ***/

class Generator {
  constructor(opt) {
    this.game = opt.game;
    this.name = opt.name;
    this.category = opt.category;
    this.income = opt.income;
    this.price = opt.price;
    this.time = opt.time;

    this.owned = opt.owned || 0;
    this.inflation = opt.inflation || 1.15;
    this.buttonID = opt.buttonID || undefined;
    this.barID = opt.barID || undefined;
    this.statsID = opt.statsID || undefined;
    this.visible = opt.visible || false;

    this.progression = 0;
    this.complete = 0;
  }

  getIncome() {
    let income = [];

    for (let key in this.income) {
      let res = this.game.resourceTable[key],
        time = this.time,
        amount = this.income[key] * this.owned,
        sec = amount / time;

      income.push(`+${Format(amount)} ${res.name} (${Format(sec)}/s)`);
    }

    return `${income.join(', ')}`;
  }

  process() {
    this.earn();
  }

  canBuy() {
    let sufficient = [],
      prices = this.getPrice(),
      i = 0;

    for (let key in this.price) {
      let res = this.game.resourceTable[key],
        amount = prices[i];

      i++;

      (res.amount >= amount) ? sufficient.push(true) : sufficient.push(false);
    }

    return sufficient.every((el) => el === true);
  }

  getPrice() {
    let prices = [];

    for (let key in this.price) {
      let price = this.price[key];

      prices.push(Math.floor(price * Math.pow(this.inflation, this.owned)));
    }

    return prices;
  }

  buy() {
    let canBuy = this.canBuy(),
      prices = this.getPrice(),
      i = 0;

    if (canBuy) {
      for (let key in this.price) {
        let res = this.game.resourceTable[key],
          amount = prices[i];

        i++;

        res.amount -= amount;
        this.owned++;
      }

      this.render('stats');
      this.tooltip();
    }
  }

  earn() {
    for (let key in this.income) {
      let res = this.game.resourceTable[key],
        amount = this.income[key];

      res.amount += (amount * this.owned);
    }
  }

  progress(times) {
    if (this.owned > 0)
      this.progression += times / this.game.options.fps;

    if (this.progression >= this.time) {
      this.progression = 0;
      this.completed++;
      this.process();
    }
  }

  visibility(visible) {
    this.visible = visible;

    if (visible)
      $(`#${this.buttonID}`).fadeIn();
    else
      $(`#${this.buttonID}`).fadeOut();

    this.render('stats');
  }

  formatStats() {
    let income = [],
      price = [],
      prices = this.getPrice(),
      i = 0;

    for (let key in this.income) {
      let res = this.game.resourceTable[key],
        amount = this.income[key];

      income.push(`+${Format(amount)} ${res.name}`);
    }

    for (let key in this.price) {
      let res = this.game.resourceTable[key],
        amount = prices[i];

      i++;

      price.push(`-${Format(amount)} ${res.name}`);
    }

    return `<p>${this.name}: ${income.join(', ')}; ${Format(this.time)}s. <span>${price.join(', ')} <span class="ui label">${this.owned}</span></span></p>`;
  }

  render(type) {
    if (!this.visible)
      return;

    if (this.statsID !== undefined && type === 'stats')
      $(`#${this.statsID}`).html(this.formatStats());

    if (this.barID !== undefined) {
      let percent = (this.progression / this.time) * 100;

      $(`#${this.barID}`).width(`${percent}%`);
    }
  }

  template() {
    return `
    <div id="${this.buttonID}" class="accordion-button noselect">
      <p id="${this.statsID}"></p>
      <div class="bar">
        <div id="${this.barID}" class="filler"></div>
      </div>
    </div>`;
  }

  tooltip() {
    let income = this.getIncome(),
      text = `${income}`;

    $(`#${this.buttonID}`).attr('data-tooltip', text);
  }

  init() {
    $(`#content-${this.category}`).append(this.template());
    $(`#${this.buttonID}`).click(() => this.buy());

    if (!this.visible)
      $(`#${this.buttonID}`).hide();

    this.render('stats');
    this.tooltip();
  }
}

module.exports = Generator;
