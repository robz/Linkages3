/* @flow */

'use strict';

var LinkageRenderer = require('./LinkageRenderer');
var LinkageUtils = require('./LinkageUtils');
var GeometryUtils = require('./GeometryUtils.js');
var UIState = require('./UIState.js');

var EDIT_STATES = UIState.EDIT_STATES;
var EDIT_STATE_TRANSITIONS = UIState.EDIT_STATE_TRANSITIONS;
var EDIT_INPUT = UIState.EDIT_INPUT;

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
  T: 116,
  W: 119,
};

var SPEED_INC = 0.04;
var BAR_INC = 1;

var SELECTED_COLOR = 'red';
var GHOST_COLOR = 'lightGray';

class LinkageUI {
  renderer: LinkageRenderer;
  linkageData: LinkageDataType;

  positions: { [key:string]: Point };
  rotate: boolean;
  speedInc: number;
  mouseIsDown: boolean;
  hoveredSegment: ?Array<{id: string}>;
  hoveredPoint: ?{id: string};
  mousePoint: Point;

  editingState: number;
  selectedPointID: string;
  selectedSegment: {
    point0ID: string; 
    point1ID: string; 
  }; 
  editingStateData: {
    grounds: Array<Point>;
    points: Array<string>; 
  };

  constructor(canvasID: string, linkageData: LinkageDataType) {
    this.renderer = new LinkageRenderer(canvasID);
    this.linkageData = linkageData;

    this.positions = LinkageUtils.calcLinkagePositions(this.linkageData);
    this.rotate = true;
    this.speedInc = SPEED_INC;
    this.mouseIsDown = false;
    this.hoveredSegment = null;
    this.hoveredPoint = null;
    this.editingState = EDIT_STATES.INITIAL;
    this.editingStateData = {grounds: [], points: []};

    var doc: any = document;
    doc.onkeypress = this._onKeyPress.bind(this);
    doc.onmousemove = this._onMouseMove.bind(this);
    doc.onmousedown = this._onMouseDown.bind(this); 
    doc.onmouseup = e => this.mouseIsDown = false;
  }

  _onMouseDown(e) {
    this.mouseIsDown = true;

    if (this.rotate) {
      return;
    }

    var input = null;
 
    if (this.hoveredPoint) {
      this.editingStateData.points.unshift(this.hoveredPoint.id);
      input = EDIT_INPUT.POINT;
    } else if (this.hoveredSegment) {
      this.editingStateData.points.unshift(this.hoveredSegment[0].id);
      this.editingStateData.points.unshift(this.hoveredSegment[1].id);
      input = EDIT_INPUT.SEGMENT;
    } else {
      this.editingStateData.grounds.unshift(this.renderer.inverseTransform(e));
      input = EDIT_INPUT.GROUND;
    }

    this.editingState = EDIT_STATE_TRANSITIONS[this.editingState][input];

    switch(this.editingState) {
      case EDIT_STATES.GROUND_TRIANGLE_1:
        LinkageUtils.addGroundSegment(
          this.linkageData,
          this.positions,
          this.editingStateData.grounds[0],
          this.editingStateData.grounds[1],
          this.editingStateData.points[0]
        );
        this.positions = LinkageUtils.calcLinkagePositions(this.linkageData);
        this.editingState = EDIT_STATES.INITIAL;
        break;
      case EDIT_STATES.GROUND_TRIANGLE_2:
        LinkageUtils.addGroundSegment(
          this.linkageData,
          this.positions,
          this.editingStateData.grounds[1],
          this.editingStateData.grounds[0],
          this.editingStateData.points[0]
        );
        this.positions = LinkageUtils.calcLinkagePositions(this.linkageData);
        this.editingState = EDIT_STATES.INITIAL;
        break;
      case EDIT_STATES.DYNAMIC_TRIANGLE:
        LinkageUtils.addTriangle(
          this.linkageData,
          this.positions,
          this.editingStateData.points[0],
          this.editingStateData.points[1],
          this.editingStateData.grounds[0] 
        );
        this.positions = LinkageUtils.calcLinkagePositions(this.linkageData);
        this.editingState = EDIT_STATES.INITIAL;
        break;
    }

    if (this.editingState === EDIT_STATES.INITIAL) {
      this.editingStateData.points = [];
      this.editingStateData.grounds = [];
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
      this._drawEditState();
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
      case KEYS.T:
        if (this.rotate) {
          this._changeSpeed(-1); 
        }
        break;
    }
  }
  
  _onMouseMove(e: Point) {
    this.mousePoint = this.renderer.inverseTransform(e);

    if (!this.rotate) {
      if (this.mouseIsDown && this.hoveredPoint) {
        var couldDrag = this._tryDraggingGroundPoint(
          this.mousePoint, 
          this.hoveredPoint.id
        );
        if (couldDrag) {
          this.editingState = 0;
        }
      } else {
        this._handleHover(this.mousePoint);
      }
    }
  }

  _toggleRotation() {
    this.rotate = !this.rotate;
    if (this.rotate) {
      this.hoveredPoint = null;
      this.hoveredSegment = null;
      this.editingState = 0;
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
      this.editingState = EDIT_STATES.INITIAL;
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
      this._changeSpeed(-1);
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
        {lineColor: 'blue'}
      );
    } else if (hoveredPoint) {
      this.renderer.drawPoint(
        this.positions[hoveredPoint.id], 
        {pointColor: 'blue'}
      );
    }
  }

  _drawEditState() {
    switch(this.editingState) {
      case EDIT_STATES.GROUND:
        this.renderer.drawSegment(
          this.editingStateData.grounds[0],
          this.mousePoint,
          {pointColor:'red', lineColor:'pink'}
        );
        break;
      case EDIT_STATES.POINT:
        this.renderer.drawSegment(
          this.positions[this.editingStateData.points[0]],
          this.mousePoint,
          {pointColor:'red', lineColor:'pink'}
        );
        break;
      case EDIT_STATES.SEGMENT:
        this.renderer.drawSegment(
          this.positions[this.editingStateData.points[0]],
          this.mousePoint,
          {pointColor:'red', lineColor:'pink'}
        );
        this.renderer.drawSegment(
          this.positions[this.editingStateData.points[1]],
          this.mousePoint,
          {pointColor:'red', lineColor:'pink'}
        );
        break;
      case EDIT_STATES.GROUND_GROUND:
        this.renderer.drawSegment(
          this.editingStateData.grounds[0],
          this.editingStateData.grounds[1],
          {pointColor:'red', lineColor:'pink'}
        );
        this.renderer.drawDirectedSegment(
          this.editingStateData.grounds[0],
          this.mousePoint,
          {pointColor:'red', lineColor:'pink'}
        );
        break;
      case EDIT_STATES.GROUND_POINT:
        this.renderer.drawSegment(
          this.positions[this.editingStateData.points[0]],
          this.editingStateData.grounds[0],
          {pointColor:'red', lineColor:'pink'}
        );
        this.renderer.drawSegment(
          this.editingStateData.grounds[0],
          this.mousePoint,
          {pointColor:'red', lineColor:'pink'}
        );
        break;
    }
  }
}

module.exports = LinkageUI;
