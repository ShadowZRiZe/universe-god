const $ = require('jquery');

const Format = require('./../util/formatter'),
  Uppercase = require('./../util/uppercase');

class Resource {
  constructor(opt) {
    this.game = opt.game;
    this.name = opt.name;

    // If the resource have other resources dependencies
    this.independant = opt.independant || false;

    this.amount = opt.amount || 0;
    this.cost = opt.cost || undefined;
    this.suffix = opt.suffix || undefined;

    // Where the resource stat should be appended
    this.visible = opt.visible || true;
    this.resourceContainer = opt.resourceContainer || undefined;
    this.resourceHolder = opt.resourceHolder || undefined;
    this.resourceID = opt.resourceID || undefined;
    this.imgPath = opt.imgPath || undefined;
  }

  visibility(visible, effect) {
    this.visible = visible;

    if (visible)
      $(`#${this.resourceHolder}`).fadeIn('slow');
    else
      $(`#${this.resourceHolder}`).fadeOut('slow');
  }

  template() {
    let img = (this.imgPath) ? `images/${this.imgPath}` : '';

    return `
    <p id="${this.resourceHolder}">
      <img class="ui resources-icon" src="${img}"> ${Uppercase(this.name)} <span id="${this.resourceID}" class="float-right bold"></span>
    </p>`;
  }

  render() {
    if (this.resourceID !== undefined && this.visible) {
      if (this.suffix !== undefined)
        $(`#${this.resourceID}`).html(`${Format(this.amount, this.suffix)}`);
      else
        $(`#${this.resourceID}`).html(`${Format(this.amount)}`);
    }
  }

  init() {
    if (this.resourceID !== undefined) {
      $(`#${this.resourceContainer}`).append(this.template());

      if (!this.visible)
        $(`#${this.resourceHolder}`).hide();
    }
  }
}

module.exports = Resource;
