
'use strict';

var CanvasRenderer = require('./CanvasRenderer');
var LinkageUtils = require('./LinkageUtils');
var GeometryUtils = require('./GeometryUtils.js');

var KEYS = {
  A: 97,
  D: 100,
  S: 115,
  SPACE: 32,
  W: 119,
};

var SPEED_INC = 0.04;
var BAR_INC = 1;

class UI {
  constructor(canvasID, linkageData) {
    this.renderer = new CanvasRenderer(canvasID);
    this.linkageData = linkageData;

    this.positions = null;
    this.rotate = true;
    this.speedInc = SPEED_INC;
    this.mouseIsDown = false;
    this.hoveredSegment = null;
    this.hoveredPoint = null;

    document.onkeypress = this._onKeyPress.bind(this);
    document.onmousemove = this._onMouseMove.bind(this);
    document.onmousedown = (e) => { this.mouseIsDown = true; };
    document.onmouseup = (e) => { this.mouseIsDown = false; };
  }

  animate() {
    if (this.rotate) {
      this._tryRotatingLinkageInput();
    }
    
    this.renderer.drawLinkage({
      points: this.linkageData.points, 
      positions: this.positions,
    });

    if (!this.rotate) {
      this._drawHoverables(this.hoveredPoint, this.hoveredSegment);
    }

    window.requestAnimationFrame(this.animate.bind(this));
  }

  _onKeyPress(e) {
    switch (e.which) {
      case KEYS.SPACE:
        this._toggleRotation();
        break;
      case KEYS.W:
        if (this.rotate) {
          this._changeSpeed(1.1);
        } else if (this.hoveredSegment) { 
          this._tryChangingBarLength(
            BAR_INC, 
            this.hoveredSegment
          );
        }
        break;
      case KEYS.S:
        if (this.rotate) {
          this._changeSpeed(1/1.1);
        } else if (this.hoveredSegment) { 
          this._tryChangingBarLength(
            -BAR_INC, 
            this.hoveredSegment
          );
        }
        break;
    }
  }
  
  _onMouseMove(e) {
    var currentPoint = this.renderer.inverseTransform(e);

    if (!this.rotate) {
      if (this.mouseIsDown && this.hoveredPoint) {
        this._tryDraggingGroundPoint(currentPoint, this.hoveredPoint.id);
      } else {
        this._handleHover(currentPoint);
      }
    }
  }

  _toggleRotation() {
    this.rotate = !this.rotate;
    if (this.rotate) {
      this.hoveredPoint = null;
      this.hoveredSegment = null;
    }
  }

  _changeSpeed(factor) {
    this.speedInc *= factor;
  }

  _tryChangingBarLength(lenChange, hoveredSegment) {
    var p0id = hoveredSegment[0].id;
    var p1id = hoveredSegment[1].id;
    var oldLen = this.linkageData.points[p0id][p1id].len;
    var newLen = oldLen + lenChange;

    try {
      this._changeBarLength(newLen, p0id, p1id);
      this.positions = LinkageUtils.calcLinkagePositions(this.linkageData);
    } catch (e) {
      this._changeBarLength(oldLen, p0id, p1id);
      this.positions = LinkageUtils.calcLinkagePositions(this.linkageData);
    } 
  }

  _changeBarLength(len, p0id, p1id) {
    this.linkageData.points[p0id][p1id].len = len;
    this.linkageData.points[p1id][p0id].len = len;

    var ext0 = this.linkageData.extenders[p0id];
    var ext1 = this.linkageData.extenders[p1id];

    if (ext0 && ext0.base === p1id) {
      ext0.len = len;
    } else if (ext1 && ext1.base === p0id) {
      ext1.len = len;
    } 
  }

  _handleHover(currentPoint) {
    var {
      closestPointInfo: hoveredPointInfo, 
      closestSegmentInfo: hoveredSegmentInfo,
    } = LinkageUtils.getClosestThings(
      this.linkageData,
      this.positions, 
      currentPoint
    );

    this.hoveredPoint = null;
    this.hoveredSegment = null;

    if (hoveredPointInfo.thing) {
      this.hoveredPoint = hoveredPointInfo.thing;
    } else if (hoveredSegmentInfo.thing) {
      this.hoveredSegment = hoveredSegmentInfo.thing;
    }
  }

  _tryDraggingGroundPoint(currentPoint, hoveredPointID) {
    var groundPoint = this.linkageData.groundPoints[this.hoveredPoint.id];

    if (!groundPoint) {
      return;
    }

    try {
      var {x: prevX, y: prevY} = groundPoint;
      groundPoint.x = currentPoint.x;
      groundPoint.y = currentPoint.y;
      this.positions = LinkageUtils.calcLinkagePositions(this.linkageData);
    } catch (e) {
      groundPoint.x = prevX;
      groundPoint.y = prevY;
      this.positions = LinkageUtils.calcLinkagePositions(this.linkageData);
    } 
  }

  _tryRotatingLinkageInput() {
    try {
      this.linkageData.extenders.p2.angle += this.speedInc;
      this.positions = LinkageUtils.calcLinkagePositions(this.linkageData);
    } catch (e) {
      // reverse direction if the configuration is invalid
      this.speedInc *= -1;
      this.linkageData.extenders.p2.angle += this.speedInc;
      this.positions = LinkageUtils.calcLinkagePositions(this.linkageData);
    }
  }

  _drawHoverables(hoveredPoint, hoveredSegment) {
    if (hoveredSegment) {
      this.renderer.drawLine(
        this.positions[hoveredSegment[0].id], 
        this.positions[hoveredSegment[1].id], 
        {lineColor: 'red'}
      );
    } else if (hoveredPoint) {
      this.renderer.drawPoint(hoveredPoint, {pointColor: 'red'});
    }
  }
}

module.exports = UI;
