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

function interpolateBetweenPoints(p1: Point, p2: Point, len: number): Point {
  var totalLen = euclid(p1, p2);
  if (len >= totalLen) {
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

function getNextPoint(path: Array<Point>, offset: number, len: number): Object {
  return {
    index: findOffset(path, offset, (point, index) => {
      var segLen = euclid(point, ixLooped(path, index + 1));
      if (len < segLen) {
        return true;
      } else {
        len -= segLen;
        return false;
      }
    }),
    remainder: len,
  };
}

// outputs a list of points of length N that are interpolated along the input
// path
function buildInterpolatedPath(path: Array<Point>, count: number): Array<Point> {
  var totalLength = path.reduce(
    (accum, elem, index, arr) => {
      return accum + euclid(elem, ixLooped(arr, index + 1))
    },
    0
  );
  var segLength = totalLength / count;
  var outputPath = [];
  var inputIndex = 0;

  for (var i = 0; i < count; i++) {
    var {remainder, index} = getNextPoint(path, inputIndex, segLength);
    if (index === -1) {
      throw new Error('we fucked up');
    }
    outputPath.push(interpolateBetweenPoints(
      path[index],
      ixLooped(path, index + 1),
      remainder
    ));
    inputIndex = index;
  }

  return outputPath;
}

module.exports = {
  calcAnglesOfPath,
  buildInterpolatedPath,
  minTotalDiff,
  smoothList,
};
