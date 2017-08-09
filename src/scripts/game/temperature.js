import $ from 'jquery';

import Format from './../util/formatter';

class Temperature {
  constructor(game) {
    this.game = game;
    
    this.value = 'n/a';
    this.celsius = 'n/a';
    this.fahrenheit = 'n/a';
    
    this.maxTemp = 25;
    
    this.init();
  }
  
  handle(action, amount) {
    if (action === '-')
      this.value -= amount;
    else if (action === '+')
      this.value += amount;
    
    this.celsius = Format(this.value);
    this.fahrenheit = Format(this.convert());
  }
  
  convert() {
    return this.value * 9 / 5 + 32;
  }
  
  progress(times) {
    if (this.game.itemTable.sun.owned) {
      if (typeof this.value !== 'number') {
        this.value = -173;
        this.celsius = this.value;
        this.fahrenheit = this.convert();
      }
      
      if (this.value < 0) {
        this.value += (times / this.game.options.fps) * 0.1;
      }
      else if (this.value <= this.maxTemp) {
        this.value += (times / this.game.options.fps) * 0.01;
      }
      
      this.celsius = Format(this.value);
      this.fahrenheit = Format(this.convert());
    }
    
    this.render();
  }
  
  template() {
    return `
    <p id="holder-temperature">Temperature
      <span id="display-temperature" class="float-right bold"></span>
    </p>
    `;
  }
  
  render() {
    if (typeof this.value === 'number')
      $('#display-temperature').html(Format(this.celsius, '°C'));
    else
      $('#display-temperature').html(this.celsius);
  }
  
  init() {
    $('#overview-container').append(this.template());
  }
}

module.exports = Temperature;