/* @flow */

'use strict';

var LinkageRenderer = require('./LinkageRenderer');
var LinkageUtils = require('./LinkageUtils');
var GeometryUtils = require('./GeometryUtils.js');

type Point = {x: number; y: number};

type LinkageDataType = {
  groundPoints: Object;
  points: Object; 
  extenders: Object;
};

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
  renderer: LinkageRenderer;
  linkageData: LinkageDataType;

  positions: { [key:string]: Point };
  rotate: boolean;
  speedInc: number;
  mouseIsDown: boolean;
  hoveredSegment: ?Array<{id: string}>;
  hoveredPoint: ?{id: string};
  potentialGroundPoint: Point;
  potentialSecondPoint: Point;
  groundSegmentState: number;

  constructor(canvasID: string, linkageData: LinkageDataType) {
    this.renderer = new LinkageRenderer(canvasID);
    this.linkageData = linkageData;

    this.positions = LinkageUtils.calcLinkagePositions(this.linkageData);
    this.rotate = true;
    this.speedInc = SPEED_INC;
    this.mouseIsDown = false;
    this.hoveredSegment = null;
    this.hoveredPoint = null;
    this.potentialGroundPoint = null;
    this.potentialSecondPoint = null;
    this.groundSegmentState = 0;

    var doc: any = document;
    doc.onkeypress = this._onKeyPress.bind(this);
    doc.onmousemove = this._onMouseMove.bind(this);
    doc.onmousedown = (e) => { this.mouseIsDown = true; };
    doc.onmouseup = this._onMouseUp.bind(this); 
  }

  _onMouseUp(e) {
    this.mouseIsDown = false;
  
    if (!this.rotate) {
      switch(this.groundSegmentState) {
        case 0:
          if (!this.hoveredPoint) {
            this.potentialGroundPoint = this.renderer.inverseTransform(e);
            this.groundSegmentState = 1;
          }
          break;
        case 1:
          if (!this.hoveredPoint) {
            this.potentialSecondPoint = this.renderer.inverseTransform(e);
            this.groundSegmentState = 2;
          }
          break;
        case 2:
          if (this.hoveredPoint) {
            LinkageUtils.addGroundSegment(
              this.linkageData,
              this.positions,
              this.potentialGroundPoint,
              this.potentialSecondPoint,
              this.hoveredPoint
            );
            this.positions = LinkageUtils.calcLinkagePositions(this.linkageData);
            this.groundSegmentState = 0;
          }
          break;
      }
    }
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
      if (this.groundSegmentState) {
        this._drawPotentials(
          this.potentialGroundPoint, 
          this.potentialSecondPoint
        );
      }
    }

    window.requestAnimationFrame(this.animate.bind(this));
  }

  _onKeyPress({which}: {which:number}) {
    switch (which) {
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
  
  _onMouseMove(e: Point) {
    var currentPoint = this.renderer.inverseTransform(e);

    if (!this.rotate) {
      if (this.mouseIsDown && this.hoveredPoint) {
        var couldDrag = this._tryDraggingGroundPoint(currentPoint, this.hoveredPoint.id);
        if (couldDrag) {
          this.groundSegmentState = 0;
        }
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
      this.groundSegmentState = 0;
    }
  }

  _changeSpeed(factor: number) {
    this.speedInc *= factor;
  }

  _tryChangingBarLength(lenChange: number, hoveredSegment: Array<{id: string}>) {
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

  _changeBarLength(len: number, p0id: string, p1id: string) {
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

  _tryDraggingGroundPoint(currentPoint: Point, hoveredPointID: string) {
    var groundPoint = this.linkageData.groundPoints[hoveredPointID];

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

  _drawHoverables(
    hoveredPoint: ?{id:string},
    hoveredSegment: ?Array<{id:string}>
  ) {
    if (hoveredSegment) {
      this.renderer.drawLine(
        this.positions[hoveredSegment[0].id], 
        this.positions[hoveredSegment[1].id], 
        {lineColor: 'red'}
      );
    } else if (hoveredPoint) {
      this.renderer.drawPoint(
        this.positions[hoveredPoint.id], 
        {pointColor: 'red'}
      );
    }
  }
  
  _drawPotentials(
    ground?: Point,
    second?: Point
  ) {
    switch (this.groundSegmentState) {
      case 2:
        this.renderer.drawLine(ground, second);
        this.renderer.drawPoint(second);
      case 1:
        this.renderer.drawPoint(ground);
        break;
    }
  }
}

module.exports = UI;
