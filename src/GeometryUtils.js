/* @flow */

'use strict';

type Point = {x: number; y: number};

function euclid(p1: Point, p2: Point): number {
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function calcSumOfMins(path1: Array<Point>, path2: Array<Point>) {
  var sum = 0;

  path1.forEach(p1 => {
    var minDist = Number.MAX_VALUE;

    path2.forEach(p2 => {
      var dist = euclid(p1, p2);
      if (dist < minDist) {
        minDist = dist;
      }
    });

    sum += minDist;
  });

  return sum;
}

function calcMinDistFromSegmentToPoint(
  segment: Object,
  p3: Point
): number {
  var point = null;
  var [p1, p2] = segment;

  var theta = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  var t = Math.sin(theta) * (p3.y - p1.y) + Math.cos(theta) * (p3.x - p1.x);

  if (t < 0) {
    point = p1;
  } else if (t > euclid(p1, p2)) {
    point = p2;
  } else {
    point = {
      x: p1.x + t * Math.cos(theta),
      y: p1.y + t * Math.sin(theta),
    };
  }

  return euclid(point, p3);
}

function findClosestThingToPoint(
  things: Array<any>,
  point: Point,
  distanceBetween: (point: Point, thing: any) => number,
  startingThing?: any,
  startingDistance?: number
): {thing: ?any; dist: number} {
  return things.reduce((best, thing) => {
    var dist = distanceBetween(thing, point);
    if (dist < best.dist) {
      best.dist = dist;
      best.thing = thing;
    }
    return best;
  }, {thing:startingThing, dist:startingDistance || 1});
}

function calcPointFromTriangle(
  p1: Point,
  p2: Point,
  a1: number,
  a2: number
): {sol1: Point; sol2: Point} {
  var a3 = euclid(p1, p2);
  if (a3 > a1 + a2) {
    throw new Error('lengths of bars less that distance between joints');
  }

  var alpha1 = Math.acos((a1*a1 + a3*a3 - a2*a2)/(2*a1*a3));
  if (!isFinite(alpha1)) {
    throw new Error('bad acos calculation');
  }

  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  if (dx === 0 && dy === 0) {
    throw new Error('enpoints are equal -> unknown angle');
  }
  var theta1 = Math.atan2(dy, dx);

  return {
    sol1: {
      x: p1.x + a1 * Math.cos(alpha1 + theta1),
      y: p1.y + a1 * Math.sin(alpha1 + theta1),
    },
    sol2: {
      x: p1.x + a1 * Math.cos(-alpha1 + theta1),
      y: p1.y + a1 * Math.sin(-alpha1 + theta1),
    },
  };
}

function calcPointFromExtender(
  p1: Point,
  p2: Point,
  len: number,
  angle: number
): Point {
  var baseAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  angle += baseAngle;
  return {
    x: p1.x + len * Math.cos(angle),
    y: p1.y + len * Math.sin(angle),
  };
}

module.exports = {
  euclid,
  calcMinDistFromSegmentToPoint,
  findClosestThingToPoint,
  calcPointFromTriangle,
  calcPointFromExtender,
  calcSumOfMins,
};
