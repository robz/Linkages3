/* @flow */

type Point = {
  x: number;
  y: number;
};

function calcAngleTo(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

function calcAnglesOfPath(path: Array<Point>): Array<number> {
  return path.map((point, index, arr) => {
    var next = arr[(index + 1) % arr.length];
    return calcAngleTo(point, next);
  });
}

function ixLooped(arr: Array<any>, i: number): any {
 return arr[(i + arr.length) % arr.length];
}

// each number becomes the average of the N adjacent numbers
// (the input list is treated as a loop)
function smoothList(list: Array<number>, range: number): Array<number> {
  return list.map((num, index, arr) => {
    var sum = 0;
    for (var i = index - range; i <= index + range; i++) {
      sum += ixLooped(arr, i);
    }
    return sum / (range * 2 + 1);
  });
}

function totalDiff(
  list1: Array<number>,
  list2: Array<number>,
  list1Offset: number,
  list2Offset: number
): number {
  if (list1.length !== list2.length) {
    throw new Error('lists must be equal to calculate their diff');
  }
  if (list1.length === 0) {
    throw new Error('lists must not be empty in order to compare');
  }
  return list1.reduce(
    (accum, e, i) => {
      return accum + Math.abs(
        ixLooped(list1, i + list1Offset) -
        ixLooped(list2, i + list2Offset)
      );
    },
    0
  );
}

// finds the minimum difference between the two lists (by incrementally shifting
// and comparing the lists)
function minTotalDiff(
  list1: Array<number>,
  list2: Array<number>
): number {
  if (list1.length !== list2.length) {
    throw new Error('lists must be equal to calculate their diff');
  }
  if (list1.length === 0) {
    throw new Error('lists must not be empty in order to compare');
  }
  return list1.reduce(
    (accum, e, i) => {
      var diff = totalDiff(list1, list2, i, 0);
      return diff < accum ? diff : accum;
    },
    Number.MAX_VALUE
  );
}

module.exports = {
  calcAnglesOfPath,
  minTotalDiff,
  smoothList,
};
