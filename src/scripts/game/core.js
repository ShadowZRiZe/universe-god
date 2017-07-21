const $ = require('jquery'),
  Transition = require('semantic-ui-transition'),
  Accordion = require('semantic-ui-accordion'),
  Dropdown = require('semantic-ui-dropdown'),
  Tab = require('semantic-ui-tab');

const Favicon = require('./../util/favicon'),
  Formatter = require('./../util/formatter'),
  Logger = require('./../util/logger');

const ResourceTable = require('./resourceTable'),
  GeneratorTable = require('./generatorTable');

var Game = {
  options: {
    version: 0.01,

    fps: 30,
    interval: 34
  },

  intervals: {},
  resourceTable: {},

  now: new Date().getTime(),
  before: new Date().getTime(),

  delta: function() {
    this.now = new Date().getTime();

    let elapsed = this.now - this.before,
      times = Math.floor(elapsed / this.options.interval);

    (elapsed > this.options.interval) ? this.render(times) : this.render(1);

    this.before = new Date().getTime();
  },

  render: function(times) {
    for (let key in this.resourceTable) {
      let res = this.resourceTable[key];

      res.render();
    }

    for (let key in this.generatorTable) {
      let gen = this.generatorTable[key];

      gen.progress(times);
      gen.render();
    }
  },

  domInit: function() {
    $('.tabular.menu .item').tab();
    $('.ui.dropdown').dropdown({
      action: 'hide'
    });
		$('.ui.accordion').accordion({
      exclusive: false
		});

    for (let key in this.resourceTable)
      this.resourceTable[key].init();

    for (let key in this.generatorTable)
      this.generatorTable[key].init();
  },

  varInit: function() {
    $.fn.transition = Transition;
    $.fn.dropdown = Dropdown;
    $.fn.tab = Tab;
    $.fn.accordion = Accordion;

    this.resourceTable = ResourceTable(this);
    this.generatorTable = GeneratorTable(this);

    this.intervals.core = setInterval(() => {
      this.delta();
    }, this.options.interval);
  },

  init: function() {
    this.varInit();
    this.domInit();

    Logger(`Welcome to Universe-God.<br>
      Quick briefing: your main goal is to create an habitable planet. Your first goal is to generate an atmosphere and create your first cells. Mass is the primary currency. You need atoms to create elements, such as water.<br>
      Don't forget, it's an early prototype: no save, expect bugs and a bad balancing.<br>
      Have fun!`, '#tab-logs');
  }
}.init();
