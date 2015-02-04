/* @flow */

'use strict';

var CanvasRenderer = require('./CanvasRenderer');
var calcLinkagePositions = require('./calcLinkagePositions');
var linkageData = require('./linkageData.js');
var euclid = require('./LinkageCalculationUtils').euclid;

var KEYS = {
  SPACE: 32,
  W: 119,
  S: 115,
};

var renderer = null;
var rotate = true;
var inc = 0.04;
var positions = null;
var closestSegment = null;

function animate() { 
  if (rotate) {
    linkageData.extenders.p2.angle += inc;
  }

  positions = calcLinkagePositions(linkageData);
  renderer.drawLinkage({points: linkageData.points, positions});
  
  if (!rotate && closestSegment) {
    renderer.drawLine(closestSegment[0], closestSegment[1], 'red');
  }

  window.requestAnimationFrame(animate);
}

function calcSegmentDist(p1, p2, p3) {
  var point = null;
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

function findClosestSegment(p3, segments) {
  return segments.reduce(function (best, segment, i) {
    var dist = calcSegmentDist(segment[0], segment[1], p3);
    if (dist < best.dist) {
      best.dist = dist;
      best.seg = segment;
    }
    return best;
  }, {seg:null, dist:1}).seg;
}

function makeSegments(positions, points) {
  var segments = [];

  Object.keys(points).forEach((pointID) => {
    Object.keys(points[pointID]).forEach((point2ID) => {
      segments.push([positions[pointID], positions[point2ID]]);
    })
  });

  return segments;
}

function init(canvasID) {
  renderer = CanvasRenderer.init(canvasID);

  document.onkeypress = function (e) {
    if (e.which === KEYS.SPACE) {
      rotate = !rotate;
      if (rotate) {
        closestSegment = null; 
      }
    } else if (e.which === KEYS.W) {
      inc *= 1.1;
    } else if (e.which === KEYS.S) {
      inc /= 1.1;
    } 
  };

  document.onmousemove = function (e) {
    if (!rotate) {
      var p3 = renderer.inverseTransform({x:e.x, y:e.y});
      closestSegment = findClosestSegment(p3, makeSegments(positions, linkageData.points));
    } 
  };

  animate();
}

module.exports = {init};
