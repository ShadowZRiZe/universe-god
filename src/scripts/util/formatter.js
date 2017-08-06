const SwarmFormat = require('swarm-numberformat'),
  f = new SwarmFormat.Formatter({backend: 'native', format: 'standard', sigfigs: 4, minSuffix: 1e6});

module.exports = function(num, suffix) {
  let result = f.format(num);

  if (suffix !== undefined)
    return `${result} ${suffix}`;

  return result;
};
