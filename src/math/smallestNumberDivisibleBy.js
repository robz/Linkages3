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

  var res = 1;
  Object.keys(totalMap).forEach(f => res *= Math.pow(f,totalMap[f]));
  return res;
}

module.exports = smallestNumberDivisibleBy;
