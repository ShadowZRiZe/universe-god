import $ from 'jquery';

import Format from './../util/formatter';

class Temperature {
  constructor() {
    this.celsius = 'n/a';
    this.fahrenheit = 'n/a';
    
    this.init();
  }
  
  setter(amount) {
    this.celsius = amount;
    this.fahrenheit = this.convert();
  }
  
  handle(action, amount) {
    if (action === '-')
      this.celsius -= amount;
    else if (action === '+')
      this.celsius += amount;
    
    this.fahrenheit = this.convert();
  }
  
  convert() {
    return this.celsius * 9 / 5 + 32;
  }
  
  template() {
    return `
    <p id="holder-temperature">Temperature
      <span id="display-temperature" class="float-right bold"></span>
    </p>
    `;
  }
  
  render() {
    if (typeof this.celsius == 'number' && typeof this.fahrenheit == 'number')
      $('#display-temperature').html(Format(this.celsius, '°C'));
    else
      $('#display-temperature').html(this.celsius);
  }
  
  init() {
    $('#overview-container').append(this.template());
  }
}

module.exports = Temperature;