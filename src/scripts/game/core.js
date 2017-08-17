import $ from 'jquery';

import Transition from 'semantic-ui-transition';
import Accordion from 'semantic-ui-accordion';
import Dropdown from 'semantic-ui-dropdown';
import Tab from 'semantic-ui-tab';

import Favicon from './../util/favicon';
import { format } from './../formatter/index';
import Logger from './../util/logger';

import ItemTable from './itemTable';
import ResourceTable from './resourceTable';
import GeneratorTable from './generatorTable';

import Temperature from './temperature';

class Game {
  constructor() {
    this.options = {
      version: 0.01,
      fps: 20,
      interval: 50
    };

    this.now = new Date().getTime();
    this.before = this.now;

    this.intervals = {};
  }

  delta() {
    this.now = new Date().getTime();

    let elapsed = this.now - this.before,
      times = Math.floor(elapsed / this.options.interval);

    (elapsed > this.options.interval) ? this.render(times) : this.render(1);

    this.before = new Date().getTime();
  }

  render(times) {
    for (let key in this.resourceTable) {
      let res = this.resourceTable[key];

      res.render();
    }

    for (let key in this.generatorTable) {
      let gen = this.generatorTable[key];

      gen.progress(times);
      gen.render();
    }

    this.temperature.progress(times);
  }

  DOMInit() {
    $('.tabular.menu .item').tab();
    $('.ui.dropdown').dropdown({
      action: 'hide'
    });
		$('.ui.accordion').accordion({
      exclusive: false
		});
  }

  VARInit() {
    $.fn.transition = Transition;
    $.fn.dropdown = Dropdown;
    $.fn.tab = Tab;
    $.fn.accordion = Accordion;

    this.temperature = new Temperature(this);

    this.resourceTable = ResourceTable(this);
    for (let key in this.resourceTable) {
      this.resourceTable[key].init();
    }

    this.generatorTable = GeneratorTable(this);
    for (let key in this.generatorTable) {
      this.generatorTable[key].init();
    }

    this.itemTable = ItemTable(this);
    for (let key in this.itemTable) {
      this.itemTable[key].init();
    }

    this.intervals.core = setInterval(() => {
      this.delta();
    }, this.options.interval);
  }

  init() {
    this.VARInit();
    this.DOMInit();

    Logger('welcome to Universe-God. Your goal is to make this planet habitable, good luck!', '#tab-logs');
  }
}

module.exports = Game;
