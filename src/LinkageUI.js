/* @flow */

'use strict';

var GeometryUtils = require('./GeometryUtils.js');
var LinkageRenderer = require('./LinkageRenderer');
var Linkage = require('./Linkage');
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
  R: 82,
};
var BAR_INC = 1;
var SPEED_INC = 0.04;
var GHOST_LINE_COLOR = 'pink';
var GHOST_POINT_COLOR = 'red';
var HOVER_LINE_COLOR = 'lightBlue';
var HOVER_POINT_COLOR = 'blue';

class LinkageUI {
  renderer: LinkageRenderer;

  rotate: boolean;
  mouseIsDown: boolean;
  mousePoint: Point;
  hoveredSegment: ?Array<{id: string}>;
  hoveredPoint: ?{id: string};

  editingState: number;
  editingStateData: {
    grounds: Array<Point>;
    points: Array<string>;
    selectedRotary: string;
  };

  constructor(canvasID: string, linkageData: LinkageDataType) {
    this.renderer = new LinkageRenderer(canvasID);
    this.linkage = new Linkage(linkageData);

    this.rotate = true;
    this.mouseIsDown = false;
    this.mouseWasDragged = false;
    this.mousePoint = null;
    this.hoveredSegment = null;
    this.hoveredPoint = null;
    this.editingState = EDIT_STATES.INITIAL;
    this.editingStateData = {grounds: [], points: [], selectedRotary: null};
    this.selectedPointID = null;
    this.selectedSegment = null;
    this.landingRotary = false;

    var doc: any = document;
    doc.onkeypress = this._onKeyPress.bind(this);
    doc.onkeydown = this._onKeyDown.bind(this);
    doc.onkeyup = this._onKeyUp.bind(this);
    doc.onmousemove = this._onMouseMove.bind(this);
    doc.onmousedown = this._onMouseDown.bind(this);
    doc.onmouseup = this._onMouseUp.bind(this);
  }

  animate() {
    if (this.rotate) {
      this.linkage.tryRotatingLinkageInput();
    }

    this.renderer.drawLinkage({
      points: this.linkage.spec.points,
      positions: this.linkage.positions,
    });

    if (!this.rotate) {
      this._drawHoverables();
    }

    if (!this.rotate || this.editingState === EDIT_STATES.ROTARY_SELECTED) {
      this._drawEditState();
    }

    window.requestAnimationFrame(this.animate.bind(this));
  }

  _onKeyDown({which}: {which:number}) {
    if (!this.rotate) {
      if (which === KEYS.R) {
        this.editingState = EDIT_STATES.ROTARY_HOVER;
      }
    }
  }

  _onKeyUp({which}: {which:number}) {
    if (!this.rotate) {
      if (which === KEYS.R) {
        this._resetEditState();
      }
    }
  }

  _resetEditState() {
    this.editingState = EDIT_STATES.INITIAL;
    this.editingStateData = {grounds: [], points: [], selectedRotary: null};
  }

  _onMouseDown(e: Point) {
    this.mouseIsDown = true;
    this.mouseWasDragged = false;
  }

  _onMouseUp(e: Point) {
    this.mouseIsDown = false;

    if (this.rotate || this.mouseWasDragged) {
      return;
    }

    var input = null;

    if (this.hoveredPoint) {
      if (this.linkage.spec.rotaries[this.hoveredPoint.id]) {
        this.editingStateData.selectedRotary = this.hoveredPoint.id;
        input = EDIT_INPUT.ROTARY;
      } else {
        this.editingStateData.points.unshift(this.hoveredPoint.id);
        input = EDIT_INPUT.POINT;
      }
    } else if (this.hoveredSegment) {
      this.editingStateData.points.unshift(this.hoveredSegment[0].id);
      this.editingStateData.points.unshift(this.hoveredSegment[1].id);
      input = EDIT_INPUT.SEGMENT;
    } else {
      this.editingStateData.grounds.unshift(this.renderer.inverseTransform(e));
      input = EDIT_INPUT.SPACE;
    }

    this.editingState = EDIT_STATE_TRANSITIONS[this.editingState][input];

    switch(this.editingState) {
      case EDIT_STATES.GROUND_TRIANGLE_1:
        this.linkage.addGroundSegment(
          this.editingStateData.grounds[0],
          this.editingStateData.grounds[1],
          this.editingStateData.points[0]
        );
        this.linkage.calculatePositions();
        this._resetEditState();
        break;
      case EDIT_STATES.GROUND_TRIANGLE_2:
        this.linkage.addGroundSegment(
          this.editingStateData.grounds[1],
          this.editingStateData.grounds[0],
          this.editingStateData.points[0]
        );
        this.linkage.calculatePositions();
        this._resetEditState();
        break;
      case EDIT_STATES.DYNAMIC_TRIANGLE:
        this.linkage.addTriangle(
          this.editingStateData.points[0],
          this.editingStateData.points[1],
          this.editingStateData.grounds[0]
        );
        this.linkage.calculatePositions();
        this._resetEditState();
        break;
      case EDIT_STATES.ROTARY_LAND:
        this.linkage.addRotaryInput(this.editingStateData.grounds[0]);
        this.linkage.calculatePositions();
        this._resetEditState();
        break;
      case EDIT_STATES.INITIAL:
        this._resetEditState();
        break;
    }
  }

  _onKeyPress({which}: {which:number}) {
    switch (which) {
      case KEYS.SPACE:
        this._toggleRotation();
        break;
      case KEYS.W:
        if (this.rotate) {
          this.linkage.changeSpeed(1.1, this.editingStateData.selectedRotary);
        } else if (this.hoveredSegment) {
          this.linkage.tryChangingBarLength(
            BAR_INC,
            this.hoveredSegment
          );
        }
        break;
      case KEYS.S:
        if (this.rotate) {
          this.linkage.changeSpeed(0.9, this.editingStateData.selectedRotary);
        } else if (this.hoveredSegment) {
          this.linkage.tryChangingBarLength(
            -BAR_INC,
            this.hoveredSegment
          );
        }
        break;
      case KEYS.T:
        if (this.rotate) {
          this.linkage.changeSpeed(-1, this.editingStateData.selectedRotary);
        }
        break;
    }
  }

  _onMouseMove(e: Point) {
    if (!this.rotate) {
      if (this.mouseIsDown) {
        this.mouseWasDragged = true;
      }

      this.mousePoint = this.renderer.inverseTransform(e);

      if (this.mouseIsDown && this.hoveredPoint) {
        var couldDrag = this.linkage.tryDraggingGroundPoint(
          this.mousePoint,
          this.hoveredPoint.id
        );
        if (couldDrag) {
          this._resetEditState();
        }
      } else {
        this._handleHover(this.mousePoint);
      }
    }
  }

  _toggleRotation() {
    this.rotate = !this.rotate;
    if (this.rotate) {
      if (this.editingState !== EDIT_STATES.ROTARY_SELECTED) {
        this._resetEditState();
      }
    }
  }

  _handleHover(currentPoint) {
    var {
      closestPointInfo: hoveredPointInfo,
      closestSegmentInfo: hoveredSegmentInfo,
    } = this.linkage.getClosestThings(currentPoint);

    this.hoveredPoint = null;
    this.hoveredSegment = null;

    if (hoveredPointInfo.thing) {
      this.hoveredPoint = hoveredPointInfo.thing;
    } else if (hoveredSegmentInfo.thing) {
      this.hoveredSegment = hoveredSegmentInfo.thing;
    }
  }

  _drawHoverables() {
    if (this.hoveredSegment) {
      this.renderer.drawLine(
        this.linkage.positions[this.hoveredSegment[0].id],
        this.linkage.positions[this.hoveredSegment[1].id],
        {lineColor: HOVER_LINE_COLOR}
      );
    } else if (this.hoveredPoint) {
      this.renderer.drawPoint(
        this.linkage.positions[this.hoveredPoint.id],
        {pointColor: HOVER_POINT_COLOR}
      );
    }
  }

  _drawEditState() {
    switch (this.editingState) {
      case EDIT_STATES.GROUND:
        this.renderer.drawSegment(
          this.editingStateData.grounds[0],
          this.mousePoint,
          {pointColor:GHOST_POINT_COLOR, lineColor:GHOST_LINE_COLOR}
        );
        break;
      case EDIT_STATES.POINT:
        this.renderer.drawSegment(
          this.linkage.positions[this.editingStateData.points[0]],
          this.mousePoint,
          {pointColor:GHOST_POINT_COLOR, lineColor:GHOST_LINE_COLOR}
        );
        break;
      case EDIT_STATES.SEGMENT:
        this.renderer.drawSegment(
          this.linkage.positions[this.editingStateData.points[0]],
          this.mousePoint,
          {pointColor:GHOST_POINT_COLOR, lineColor:GHOST_LINE_COLOR}
        );
        this.renderer.drawSegment(
          this.linkage.positions[this.editingStateData.points[1]],
          this.mousePoint,
          {pointColor:GHOST_POINT_COLOR, lineColor:GHOST_LINE_COLOR}
        );
        break;
      case EDIT_STATES.GROUND_GROUND:
        this.renderer.drawSegment(
          this.editingStateData.grounds[0],
          this.editingStateData.grounds[1],
          {pointColor:GHOST_POINT_COLOR, lineColor:GHOST_LINE_COLOR}
        );
        this.renderer.drawDirectedSegment(
          this.editingStateData.grounds[0],
          this.mousePoint,
          {pointColor:GHOST_POINT_COLOR, lineColor:GHOST_LINE_COLOR}
        );
        break;
      case EDIT_STATES.GROUND_POINT:
        this.renderer.drawSegment(
          this.linkage.positions[this.editingStateData.points[0]],
          this.editingStateData.grounds[0],
          {pointColor:GHOST_POINT_COLOR, lineColor:GHOST_LINE_COLOR}
        );
        this.renderer.drawSegment(
          this.editingStateData.grounds[0],
          this.mousePoint,
          {pointColor:GHOST_POINT_COLOR, lineColor:GHOST_LINE_COLOR}
        );
        break;
      case EDIT_STATES.ROTARY_HOVER:
        if (this.mousePoint) {
          this.renderer.drawSegment(
            this.mousePoint,
            {x:this.mousePoint.x + 1, y:this.mousePoint.y},
            {pointColor:GHOST_POINT_COLOR, lineColor:GHOST_LINE_COLOR}
          );
          this.renderer.drawSegment(
            this.mousePoint,
            {x:this.mousePoint.x + 3, y:this.mousePoint.y + 4},
            {pointColor:GHOST_POINT_COLOR, lineColor:GHOST_LINE_COLOR}
          );
        }
        break;
      case EDIT_STATES.ROTARY_SELECTED:
        var extenderId = this.linkage.spec.rotaries[this.editingStateData.selectedRotary];
        var extender = this.linkage.spec.extenders[extenderId];
        this.renderer.drawSegment(
          this.linkage.positions[extenderId],
          this.linkage.positions[extender.base],
          {pointColor:GHOST_POINT_COLOR, lineColor:GHOST_LINE_COLOR}
        );
        this.renderer.drawSegment(
          this.linkage.positions[extender.ref],
          this.linkage.positions[extender.base],
          {pointColor:GHOST_POINT_COLOR, lineColor:GHOST_LINE_COLOR}
        );
        break;
    }
  }
}

module.exports = LinkageUI;
