/* @flow */

'use strict';

var CanvasRenderer = require('./CanvasRenderer');
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

function getSegments(points, positions) {

}

function animate() { 
  linkageData.extenders.p2.angle += inc;
  positions = calcLinkagePositions(linkageData);
  renderer.drawLinkage({points: linkageData.points, positions});

  if (rotate) {
    window.requestAnimationFrame(animate);
  }
}

function init(canvasID) {
  renderer = CanvasRenderer.init(canvasID);

  document.onkeypress = function (e) {
    if (e.which === KEYS.SPACE) {
      rotate = !rotate;

      if (rotate) {
        window.requestAnimationFrame(animate);
      }
    } else if (e.which === KEYS.W) {
      inc *= 1.1;
    } else if (e.which === KEYS.S) {
      inc /= 1.1;
    } 
  };

  document.onmousemove = function (e) {
    console.log(e.x, e.y);
    
  };

  animate();
}

module.exports = {init};
