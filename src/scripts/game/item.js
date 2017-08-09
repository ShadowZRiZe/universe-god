import $ from 'jquery';

import Format from './../util/formatter';

class Item {
  constructor(opt) {
    this.game = opt.game;
    
    this.name = opt.name;
    this.desc = opt.desc;
    this.category = opt.category;
    
    this.buttonID = opt.buttonID;
    this.statsID = opt.buttonID + '-stats';
    
    this.cost = opt.cost;
    this.callback = opt.callback;
    
    this.visible = opt.visible || false;
    this.owned = opt.owned || false;
  }
  
  sufficient() {
    let sufficient = [];
    
    for (let key in this.cost) {
      let res = this.game.resourceTable[key],
        cost = this.cost[key];
      
      (res.amount >= cost) ? sufficient.push(true) : sufficient.push(false);
    }
    
    return sufficient.every((el) => el === true);
  }
  
  infos() {
    let cost = [],
      owned = (this.owned) ? 'bought' : 'available';
    
    for (let key in this.cost) {
      let res = this.game.resourceTable[key],
        price = this.cost[key];
      
      cost.push(`-${Format(price)} ${res.name}`);
    }
    
    cost = cost.join(', ');
    
    return {
      cost: cost,
      owned: owned
    };
  }
  
  buy() {
    if (this.sufficient() && !this.owned) {
      for (let key in this.cost) {
        let res = this.game.resourceTable[key],
          cost = this.cost[key];
        
        res.amount -= cost;
      }
      
      this.owned = true;
      this.render();
    }
  }
  
  text() {
    let cost = this.infos().cost,
      owned = this.infos().owned;
    
    return `<p><b>${this.name}</b>: ${this.desc}
      <br>${cost}
      <span>
        <span class="ui label">${owned}</span>
      </span>
    </p>`;
  }
  
  template() {
    return `
    <div id="${this.buttonID}" class="accordion-button standalone noselect">
      <p id="${this.statsID}"></p>
    </div>`;
  }
  
  render() {
    $(`#${this.statsID}`).html(this.text());
  }
  
  init() {
    $(`#content-${this.category}`).append(this.template());
    $(`#${this.buttonID}`).click(() => this.buy());
    
    if (!this.visible)
      $(`#${this.buttonID}`).hide();
    
    this.render();
  }
}

module.exports = Item;