/* @flow */

function primeFactors(x: number): Object {
  var map = {};

  var res = x;
  for (var n = 2; n <= x; n++) {
    var count = 0;

    while (res % n === 0) {
      res = res / n;
      count += 1;
    }

    if (count > 0) {
      map[n] = count;
    }
  }

  return map;
}

function smallestNumberDivisibleBy(list: Array<number>): number {
  var occurences = {};

  // find occurences of all prime factors for each number
  list.forEach(x => {
    var map = primeFactors(x);
    Object.keys(map).forEach(factor => {
      if (
        typeof occurences[factor] !== 'number' ||
        occurences[factor] < map[factor]
      ) {
        occurences[factor] = map[factor];
      }
    });
  });

  // multiply factors raised to their occurrence
  return Object.keys(occurences).reduce(
    (acc, f) => acc * Math.pow(f, occurences[f]),
    1
  );
}

module.exports = smallestNumberDivisibleBy;
