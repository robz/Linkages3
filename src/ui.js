/* @flow */

'use strict';

var CanvasRenderer = require('./CanvasRenderer');
var LinkageUtils = require('./LinkageUtils');
var GeometryUtils = require('./GeometryUtils.js');

var KEYS = {
  SPACE: 32,
  W: 119,
  S: 115,
};

var INC = 0.04;

class UI {
  constructor(canvasID, linkageData) {
    this.linkageData = linkageData;
    this.renderer = CanvasRenderer.init(canvasID);
    this.rotate = true;
    this.positions = null;
    this.inc = INC;

    document.onkeypress = this.onKeyPress.bind(this);
    document.onmousemove = this.onMouseMove.bind(this);
  }

  resetHoverables() {
    this.closestSegment = null;
    this.closestPoint = null;
  }

  onKeyPress(e) {
    if (e.which === KEYS.SPACE) {
      this.rotate = !this.rotate;
      if (this.rotate) {
        this.resetHoverables();
      }
    } else if (e.which === KEYS.W) {
      this.inc *= 1.1;
    } else if (e.which === KEYS.S) {
      this.inc /= 1.1;
    } 
  }

  onMouseMove(e) {
    if (!this.rotate) {
      this.resetHoverables();

      var p3 = this.renderer.inverseTransform({x:e.x, y:e.y});

      var closestPointInfo = GeometryUtils.findClosestThingToPoint(
        Object.keys(this.positions).map(id => this.positions[id]),
        p3, 
        GeometryUtils.euclid
      );

      var closestSegmentInfo = GeometryUtils.findClosestThingToPoint(
        LinkageUtils.makeSegmentsFromLinkage(this.linkageData, this.positions),
        p3, 
        GeometryUtils.calcMinDistFromSegmentToPoint
      );

      if (closestPointInfo.thing) {
        this.closestPoint = closestPointInfo.thing;
      } else {
        this.closestSegment = closestSegmentInfo.thing;
      }
    }
  }

  animate() {
    if (this.rotate) {
      this.linkageData.extenders.p2.angle += this.inc;
    }

    this.positions = LinkageUtils.calcLinkagePositions(this.linkageData);
    this.renderer.drawLinkage({
      points: this.linkageData.points, 
      positions: this.positions,
    });
    
    if (!this.rotate) {
      if (this.closestSegment) {
        this.renderer.drawLine(
          this.closestSegment[0], 
          this.closestSegment[1], 
          'red'
        );
      } else if (this.closestPoint) {
        this.renderer.drawPoint(this.closestPoint, 'red');
      }
    }

    window.requestAnimationFrame(this.animate.bind(this));
  }
}

module.exports = UI;
