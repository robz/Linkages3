/* @flow */
'use strict';

var UIState = require('./UIState');
var LinkageRenderer = require('./LinkageRenderer');
var Linkage = require('./Linkage');

type Point = {x: number; y: number};

class UI {
  renderer: LinkageRenderer;
  state: UIState;

  mousePoint: Point;
  dragging: boolean;

  hoverSegmentIDs: ?Array<string>;
  hoverPointID: string;
  hoverPoint: boolean;
  hoverGround: boolean;
  hoverRotary: boolean;

  constructor(canvasID: string, linkage: Linkage) {
    linkage.calculatePositions();

    this.renderer = new LinkageRenderer(canvasID);
    this.state = UIState.getInitialState(linkage);

    this.mousePoint = {x:0, y:0};
    this.dragging = false;

    this.hoverSegmentIDs = null;
    this.hoverPointID = '';
    this.hoverPoint = false;
    this.hoverGround = false;
    this.hoverRotary = false;

    var doc: any = document;
    doc.onkeyup = this.onKeyUp.bind(this);
    doc.onkeydown = this.onKeyDown.bind(this);
    doc.onkeypress = this.onKeyPress.bind(this);
    doc.onmousemove = this.onMouseMove.bind(this);
    doc.onmousedown = this.onMouseDown.bind(this);
    doc.onmouseup = this.onMouseUp.bind(this);
  }

  animate(): void {
    this.state.linkage.calculatePositions();
    this.state.draw(this.renderer, this.mousePoint);
    window.requestAnimationFrame(this.animate.bind(this));
  }

  onMouseDown(e: Point): void {
    this.dragging = true;
    var newState = null;

    if (this.hoverRotary) {
      newState = this.state.onRotaryDown(this.hoverPointID);
    } else if (this.hoverGround) {
      newState = this.state.onGroundDown(this.hoverPointID);
    }

    this.state = newState ? newState : this.state;
  }

  onMouseUp(e: Point): void {
    this.dragging = false;

    var mousePoint = this.renderer.inverseTransform(e);
    var newState = this.state.onMouseUp(mousePoint);

    if (!newState && this.hoverPointID) {
      newState = this.state.onAnyPointUp(this.hoverPointID);
    }

    if (!newState) {
      if (this.hoverSegmentIDs) {
        newState = this.state.onSegmentUp(this.hoverSegmentIDs[0], this.hoverSegmentIDs[1]);
      } else if (this.hoverPoint || this.hoverGround || this.hoverRotary) {
        newState = this.state.onPointUp(this.hoverPointID);
      } else {
        newState = this.state.onCanvasUp(mousePoint);
      }
    }

    this.state = newState ? newState : this.state;
  }

  onMouseMove(e: Point): void {
    var mousePoint = this.renderer.inverseTransform(e);

    if (this.dragging) {
      var newState = this.state.onMouseDrag(mousePoint);
      this.state = newState ? newState : this.state;
    } else {
      this.setHovers(mousePoint);
    }

    this.mousePoint = mousePoint;
  }

  onKeyUp(e: {which: number}): void {
    var newState = this.state.onKeyUp(e.which);
    this.state = newState ? newState : this.state;
  }

  onKeyDown(e: {which: number}): void {
    var newState = this.state.onKeyDown(e.which);
    this.state = newState ? newState : this.state;
  }

  onKeyPress(e: {which: number}): void {
    var newState = this.state.onKeyPress(e.which);
    this.state = newState ? newState : this.state;
  }

  setHovers(currentPoint: Point): void {
    this.hoverSegmentIDs = null;
    this.hoverPointID = '';
    this.hoverPoint = false;
    this.hoverGround = false;
    this.hoverRotary = false;

    var {closestPointInfo, closestSegmentInfo} =
      this.state.linkage.getClosestThings(currentPoint);

    if (closestPointInfo.thing) {
      this.hoverPointID = closestPointInfo.thing.id;

      if (this.state.linkage.spec.rotaries[this.hoverPointID]) {
        this.hoverRotary = true;
      } else if (this.state.linkage.spec.groundPoints[this.hoverPointID]) {
        this.hoverGround = true;
      } else if (this.state.linkage.spec.points[this.hoverPointID]) {
        this.hoverPoint = true;
      }
    } else if (closestSegmentInfo.thing) {
      this.hoverSegmentIDs = [
        closestSegmentInfo.thing[0].id,
        closestSegmentInfo.thing[1].id
      ];
    }
  }
}

module.exports = UI;
