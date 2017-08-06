import $ from 'jquery';

import Format from './../util/formatter';

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
    
    this.buttonID = opt.buttonID || undefined;
    this.barID = opt.barID || this.buttonID + '-bar';
    this.statsID = opt.statsID || this.buttonID + '-stats';
    this.pauseID = opt.pauseID || this.buttonID + '-pause';
    this.sellID = opt.sellID || this.buttonID + '-sell';

    this.visible = opt.visible || false;
    this.paused = opt.paused || false;
  }
  
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
      let res = this.game.resourceTable[key];
      
      income.push(`+${Format(this.income[key])} ${res.name}`);
    }
    
    for (let key in this.cost) {
      let res = this.game.resourceTable[key],
        price = Math.floor(this.cost[key] * Math.pow(this.inflation, this.owned));
      
      cost.push(`-${Format(price)} ${res.name}`);
    }
    
    return {
      income: income,
      cost: cost
    };
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
        income = this.income[key] * amount;
      
      res.earn(this.owned, income);
    }
  }
  
  progress(times) {
    if (this.owned > 0 && !this.paused)
     this.progression += times / this.game.options.fps;
    
    if (this.progression >= this.time)
      this.process();
  }
  
  text() {
    let cost = this.infos().cost,
      income = this.infos().income;

    return `<p><b>${this.name}</b>: ${income}; ${Format(this.time)}s.
      <span>
        ${cost}
        <span class="ui label">${this.owned}</span>
      </span>
    </p>`;
  }
  
  tooltip() {
    let income = [],
      cost = [];
    
    for (let key in this.income) {
      let res = this.game.resourceTable[key],
        amount = this.income[key] * this.owned,
        sec = amount / this.time;
      
      income.push(`+${Format(amount)} ${res.name} (${Format(sec)}/s)`);
      
      for (let item in res.cost) {
        let amount = res.cost[item] * this.owned,
          sec = amount / this.time;

        cost.push(`-${Format(amount)} ${res.name} (${Format(sec)}/s)`);
      }
    }
    
    return `${income.join(', ')}; ${cost.join(', ')}`;
  }
  
  template() {
    return `
    <div id="${this.buttonID}" class="accordion-button noselect">
      <div class="ui grid grid-accordion">
        <div class="two wide column pause">
          <i id="${this.pauseID}" class="pause icon accordion-pause"></i>
        </div>
        <div class="one wide column sell">
          <i id="${this.sellID}" class="dollar icon accordion-pause"></i>
        </div>
        <div class="thirteen wide column buy">
          <p id="${this.statsID}"></p>
        </div>
      </div>

      <div class="bar">
        <div id="${this.barID}" class="filler"></div>
      </div>
    </div>`;
  }
  
  render(fullRender) {
    let percent = (this.progression / this.time) * 100;
    
    if (fullRender) {
      $(`#${this.statsID}`).html(this.text());
      $(`#${this.buttonID}`).attr('data-tooltip', this.tooltip());
    }
  
    $(`#${this.barID}`).width(`${percent}%`);
  }
  
  init() {
    $(`#content-${this.category}`).append(this.template());
    $(`#${this.pauseID}`).click(() => this.pause());
    $(`#${this.sellID}`).click(() => this.sell());
    $(`#${this.statsID}`).click(() => this.buy());

    if (!this.visible)
      $(`#${this.buttonID}`).hide();

    this.render(true);
  }
}

module.exports = Generator;