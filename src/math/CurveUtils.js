/* @flow */

var {
  euclid,
} = require('../math/GeometryUtils');

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

function ixLoop(arr: Array<any>, i: number): any {
 return arr[(i + arr.length) % arr.length];
}

// each number becomes the average of the N adjacent numbers
// (the input list is treated as a loop)
function smoothList(list: Array<number>, range: number): Array<number> {
  return list.map((num, index, arr) => {
    var sum = 0;
    for (var i = index - range; i <= index + range; i++) {
      sum += ixLoop(arr, i);
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
        ixLoop(list1, i + list1Offset) -
        ixLoop(list2, i + list2Offset)
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

function interpolateBetweenPoints(p1: Point, p2: Point, len: number): Point {
  var totalLen = euclid(p1, p2);
  if (len > totalLen) {
    throw new Error('the distance between the points is less than the length to interpolate');
  }

  var angle = calcAngleTo(p1, p2);
  return {
    x: p1.x + len * Math.cos(angle),
    y: p1.y + len * Math.sin(angle),
  };
}

// Array.prototype.find with an offset
function findOffset(arr: Array<any>, offset: number, cond: Function): ?any {
  for (var i = offset; i < arr.length; i++) {
    if (cond(arr[i], i)) {
      return i;
    }
  }
  return -1;
}

Array.prototype.find = function(cond) {
  for (var i = 0; i < this.length; i++) {
    if (cond(this[i], i)) {
      return i;
    }
  }
  return -1;
}

function findPointsBetween(path, dist) {
  var accum = 0;
  var i1 = path.find((p, i) => {
    var additional = euclid(p, ixLoop(path, i + 1));
    if (dist <= accum + additional) {
      return true;
    }
    accum += additional;
    return false;
  });
  return {
    i1,
    i2: (i1 + 1) % path.length,
    len: dist - accum,
  };
}

// outputs a list of points of length N that are interpolated along the input
// path
function interpolatePath(path, numPoints) {
  var totalLen = 0;
  path.forEach((p, i) => {
    totalLen += euclid(p, ixLoop(path, i + 1));
  });
  var segLen = totalLen / numPoints;
  path = path.concat([path[0]]);

  var outputPath = [path[0]];
  for (var ii = 0; ii < numPoints - 1; ii++) {
    var {i1, i2, len} = findPointsBetween(path, segLen);
    var point = interpolateBetweenPoints(path[i1], path[i2], len);
    outputPath.push(point);
    path = [point].concat(path.slice(i2, path.length));
  }
  return outputPath;
}

module.exports = {
  calcAnglesOfPath,
  interpolateBetweenPoints,
  interpolatePath,
  minTotalDiff,
  smoothList,
};
