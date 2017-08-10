const $ = require('jquery'),
  Typed = require('typed.js'),
  Moment = require('moment');

module.exports = function(str, el) {
  let rand = Math.floor(Math.random() * 1e6),
    time = Moment().format('LTS'),
    text = `<span>${time}</span>: ${str}`;

  $(el).append(`<p><span id="typed-${rand}"></span></p>`);

  let typed = new Typed(`#typed-${rand}`, {
    strings: [text],
    typeSpeed: 30,
    cursorChar: '_',
    autoInsertCss: false,

    onComplete: (self) => $(self.cursor).remove()
  });
};
