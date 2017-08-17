// List of big numbers from: http://home.kpn.nl/vanadovv/BignumbyN.html
import standardSuffixes from './standard-suffixes.json';

function logFloor(number) {
  let count = 0;

  while(number >= 10) {
    count++;
    number /= 10;
  }

  return count;
}

function numberWithCommas(number) {
  let parts = number.toString().split('.');

  return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (parts[1] ? '.' + parts[1] : '');
}

function format(number, decimals, unit) {
  var digits = decimals || 0;

  if (number >= 1e6) {
    let index = Math.floor(logFloor(number) / 3),
      prefix = format(number / Math.pow(10, 3 * index), 3),
      unity = (unit === undefined) ? '' : unit;

    return `${prefix}${standardSuffixes.short[index - 2]} ${unity}`;
  }
  else if (typeof number === 'undefined' || number === 0 || isNaN(number)) {
    return 0;
  }
  else {
    return numberWithCommas(number.toFixed(digits));
  }
}

export { format };
