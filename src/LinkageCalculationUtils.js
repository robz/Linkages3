/* @flow */
type Point = {x: number; y: number};

function euclid(p1: Point, p2: Point): number {
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function calcFromTriangle(
  p1: Point, 
  p2: Point, 
  d1: number, 
  d2: number
): Point {
  var d3 = euclid(p1, p2);
  if (d3 > d1 + d2) {
    throw new Error('lengths of bars less that distance between joints');
  }

  var theta0 = Math.acos((d1*d1 + d3*d3 - d2*d2)/(2*d1*d3));
  if (isNaN(theta0) || !isFinite(theta0)) {
    throw new Error('bad acos calculation');
  }

  var theta01 = Math.atan2(p2.y - p1.y, p2.x - p1.x);

  return {
    x: p1.x + d1 * Math.cos(theta0 - theta01), 
    y: p1.y + d1 * Math.sin(theta0 - theta01),
  };
}

function calcFromExtender(
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

module.exports = { euclid, calcFromTriangle, calcFromExtender };
