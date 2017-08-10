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
    this.level = opt.level || 0;
    this.levelCost = opt.levelCost;
    this.levelEffect = opt.levelEffect;
    this.levelInflation = 5;
    this.progression = 0;
    
    this.buttonID = opt.buttonID || undefined;
    this.barID = this.buttonID + '-bar';
    this.statsID = this.buttonID + '-stats';
    this.pauseID = this.buttonID + '-pause';
    this.sellID = this.buttonID + '-sell';
    this.upgradeID = this.buttonID + '-upgrade';

    this.visible = opt.visible || false;
    this.paused = opt.paused || false;
  }
  
  getUpgradeMult() {
    if (this.level < 1) {
      return 1;
    }
    else {
      return this.level * this.levelEffect;
    }
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
      let res = this.game.resourceTable[key],
        baseIncome = this.income[key] * this.getUpgradeMult();
      
      income.push(`+${Format(baseIncome)} ${res.name}`);
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
      cost = [],
      upgrade = Math.floor(this.levelCost * Math.pow(this.levelInflation, this.level + 1));
    
    for (let key in this.income) {
      let res = this.game.resourceTable[key],
        amount = (this.income[key] * this.getUpgradeMult()) * this.owned,
        sec = amount / this.time;
      
      income.push(`+${Format(amount)} ${res.name} (${Format(sec)}/s)`);
      
      for (let item in res.cost) {
        let amount = res.cost[item] * this.owned;

        cost.push(`-${Format(amount)} ${item}`);
      }
    }
    
    return {
      stats: `${income.join(', ')}; ${cost.join(', ')}`,
      upgrade: `Upgrade: -${Format(upgrade)} mass, x${this.levelEffect} base prod.`
    };
  }
  
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
        <div class="twelve wide column buy">
          <p id="${this.statsID}"></p>
        </div>
      </div>

      <div class="bar">
        <div id="${this.barID}" class="filler"></div>
      </div>
    </div>`;
  }
  
  render(fullRender) {
    let percent = (this.progression / this.time) * 100,
      tooltip = this.tooltip();
    
    if (fullRender) {
      $(`#${this.statsID}`).html(this.text()).attr('data-tooltip', tooltip.stats);
      $(`#${this.upgradeID}`).parent().attr('data-tooltip', tooltip.upgrade);
    }
  
    $(`#${this.barID}`).width(`${percent}%`);
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