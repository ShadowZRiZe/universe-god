/**
 *  The value returned is meant to be used with a for...of loop with
 *  destructuring variables such as [index, value] where index is the
 *  name of the resource and value is the calculated price.
 */
function cost(Generator) {
  let cost = [];

  for (let [index, value] of Object.entries(Generator.cost)) {
    let price = Math.floor(value * Math.pow(Generator.inflation, Generator.owned));

    cost.push([index, price]);
  }

  return cost;
}

export { cost };
