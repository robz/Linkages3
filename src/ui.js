/* @flow */

'use strict';

var CanvasRenderer = require('./CanvasRenderer');
var makeSegmentsFromLinkage = 
  require('./LinkageCalculationUtils').makeSegmentsFromLinkage;
var calcLinkagePositions = require('./calcLinkagePositions');
var linkageData = require('./linkageData.js');
var geometry = require('./geometry.js');

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
var closestPoint = null;

function animate() { 
  if (rotate) {
    linkageData.extenders.p2.angle += inc;
  }

  positions = calcLinkagePositions(linkageData);
  renderer.drawLinkage({points: linkageData.points, positions});
  
  if (!rotate && closestSegment) {
    renderer.drawLine(closestSegment[0], closestSegment[1], 'red');
  } else if (!rotate && closestPoint) {
    renderer.drawPoint(closestPoint, 'red');
  }

  window.requestAnimationFrame(animate);
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
      closestPoint = null;
      closestSegment = null;

      var p3 = renderer.inverseTransform({x:e.x, y:e.y});

      var closestPointInfo = geometry.findClosestThingToPoint(
        Object.keys(positions).map(id => positions[id]),
        p3, 
        geometry.euclid
      );

      if (closestPointInfo.thing) {
        closestPoint = closestPointInfo.thing;
        return;
      }

      var closestSegmentInfo = geometry.findClosestThingToPoint(
        makeSegmentsFromLinkage(linkageData, positions), 
        p3, 
        geometry.calcMinDistFromSegmentToPoint
      );

      closestSegment = closestSegmentInfo.thing;
    }
  };

  animate();
}

module.exports = {init};
