const Favico = require('favico.js'),
  favicon = new Favico({
    animation: 'none',
    bgColor: '#000'
  });

let badge = 0;

module.exports = function(type, amount) {
  if (type === '-')
    badge -= amount;
  else if (type === '+')
    badge += amount;

  favicon.badge(badge);
};
