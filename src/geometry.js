/* @flow */

'use strict';

var euclid = require('./LinkageCalculationUtils').euclid;

type Point = {x: number; y: number};

var sin = Math.sin;
var cos = Math.cos;
var atan2 = Math.atan2;

function pointToSegmentDistance(p1: Point, p2: Point, p3: Point): number {
  var d = euclid(p1, p2);
  var theta = atan2(p2.y - p1.y, p2.x - p1.x);
  var sin_theta = sin(theta);
  var cos_theta = cos(theta);

  if (sin_theta === 0) {
    // do something else
    throw new Error('todo');
  }

  var term1 = (p3.y - p1.y) / (d * sin_theta);
  var term2 = cos_theta * (p1.x - p3.x) / (d * sin_theta * sin_theta);
  var term3 = (cos_theta * cos_theta)/(sin_theta * sin_theta) + 1;

  if (term3 === 0) {
    throw new Error('err');
  }

  var t = (term1 - term2) / term3;
 
  if (t < 0) {
    return euclid(p3, p1);
  } else if (t > 1) {
    return euclid(p3, p2);
  } else {
    return euclid(p3, {
      x: p1.x + d * t * cos(theta),
      y: p1.y + d * t * sin(theta),
    });
  }
}

function closestSegmetnToPoint(p0: Point, segments: Array) {
  return segments.reduce((current, segment, index) => {
    var distance = pointToSegmentDistance(p0, segment[0], segment[1]);
    if (distance < current.distance) {
      current.distance = distance;
      current.index = index;
    }
    return current;
  }, {
    index: Number.MAX_VALUE,
    distance: -1,
  });
}
