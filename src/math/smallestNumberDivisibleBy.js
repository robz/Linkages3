/* @flow */

function primeFactors(x: number): Object {
  var map = {};

  var res = x;
  for (var n = 2; n <= x; n++) {
    var count = 0;

    while (res%n === 0) {
      res = res/n;
      count += 1;
    }

    if (count > 0) {
      map[n] = count;
    }
  }

  return map;
}

function smallestNumberDivisibleBy(list: Array<number>) {
  var totalMap = {};

  list.forEach(x => {
    var map = primeFactors(x);
    Object.keys(map).forEach(factor => {
      if (
        typeof totalMap[factor] !== 'number' ||
        totalMap[factor] < map[factor]
      ) {
        totalMap[factor] = map[factor];
      }
    });
  });

  return Object.keys(totalMap).reduce((a,f) => a*Math.pow(f, totalMap[f]), 1);
}

module.exports = smallestNumberDivisibleBy;
