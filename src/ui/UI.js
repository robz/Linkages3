/* @flow */
'use strict';

var Linkage = require('../Linkage');
var LinkageRenderer = require('../graphics/LinkageRenderer');
var LoggedUIEvent = require('./LoggedUIEvent');
var UIState = require('./UIState');

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

  stateLog: Array<string>;
  eventLog: Array<LoggedUIEvent>;
  initialSpec: string;

  // called from the browser console to extract logs
  logAndReset() {
    var name = this.stateLog.join('_');
    var finalSpec = JSON.stringify(this.state.linkage.spec);
    console.log(`var ${name} = {
  initialSpec: ${this.initialSpec},
  finalSpec: ${finalSpec},
  eventLog: ${JSON.stringify(this.eventLog)},
};`);
    this.initialSpec = finalSpec;
    this.eventLog = [];
    this.stateLog = [];
  }

  constructor(
    state: UIState,
    renderer: LinkageRenderer
  ) {
    this.state = state;
    this.renderer = renderer;
    this.eventLog = [];
    this.stateLog = [this.state.constructor.name];
    this.initialSpec = JSON.stringify(this.state.linkage.spec);

    // need to have initial positions calculated for hover to work
    this.state.linkage.calculatePositions();

    this.mousePoint = {x:0, y:0};
    this.dragging = false;

    this.hoverSegmentIDs = null;
    this.hoverPointID = ''; // ugh flow
    this.hoverPoint = false;
    this.hoverGround = false;
    this.hoverRotary = false;

    //
    // wrap key and mouse handler methods, logging the event name, and key
    // pressed or mouse position. we can extract the log from the console, and
    // use it to make integration tests that are abstracted from the browser.
    // (see src/__tests__/Integration-test.js)
    //
    var makeHandler = (name, getData) =>
      e => {
        var data = getData(e);

        var prevEvent = this.eventLog.slice(-1)[0];
        if (prevEvent && prevEvent.handlerName === name) {
          this.eventLog.pop();
        }
        this.eventLog.push(new LoggedUIEvent(name, data));

        (this: any)[name](data);

        var stateName = this.state.constructor.name;
        if (this.stateLog.slice(-1)[0] !== stateName) {
          this.stateLog.push(stateName);
        }
      }

    var getKey = e => e.which;
    var getMousePoint = e => this.renderer.inverseTransform(e);

    var doc: any = document;
    doc.onkeyup = makeHandler('onKeyUp', getKey);
    doc.onkeydown = makeHandler('onKeyDown', getKey);
    doc.onkeypress = makeHandler('onKeyPress', getKey);
    doc.onmousemove = makeHandler('onMouseMove', getMousePoint);
    doc.onmousedown = makeHandler('onMouseDown', getMousePoint);
    doc.onmouseup = makeHandler('onMouseUp', getMousePoint);
  }

  animate(): void {
    var mouseInfo:any = {
      mousePoint: this.mousePoint
    };

    var {hoverSegmentIDs, hoverPointID} = this;

    if (hoverSegmentIDs) {
      mouseInfo.p0id = hoverSegmentIDs[0];
      mouseInfo.p1id = hoverSegmentIDs[1];
    } else if (hoverPointID) {
      mouseInfo.p0id = hoverPointID;
    }

    this.state.draw(this.renderer, mouseInfo);
    window.requestAnimationFrame(this.animate.bind(this));
  }

  onMouseDown(mousePoint: Point): void {
    this.dragging = true;

    var newState = null;

    if (this.hoverSegmentIDs) {
      newState = this.state.onSegmentDown(
        this.hoverSegmentIDs[0],
        this.hoverSegmentIDs[1]
      );
    } else if (this.hoverRotary) {
      newState = this.state.onRotaryDown(this.hoverPointID);
    } else if (this.hoverGround) {
      newState = this.state.onGroundDown(this.hoverPointID);
    } else if (this.hoverPoint) {
      newState = this.state.onPointDown(this.hoverPointID);
    } else {
      newState = this.state.onCanvasDown(mousePoint);
      if (!newState) {
        newState = this.state.onMouseDown(mousePoint);
      }
    }

    this.state = newState ? newState : this.state;
    this.setHovers(mousePoint);
  }

  onMouseUp(mousePoint: Point): void {
    this.dragging = false;

    var newState = this.state.onMouseUp(mousePoint);

    if (!newState) {
      if (this.hoverSegmentIDs) {
        newState = this.state.onSegmentUp(
          this.hoverSegmentIDs[0],
          this.hoverSegmentIDs[1]
        );
      } else if (this.hoverPointID) {
        newState = this.state.onAnyPointUp(this.hoverPointID);
      } else {
        newState = this.state.onCanvasUp(mousePoint);
      }
    }

    this.state = newState ? newState : this.state;
    this.setHovers(mousePoint);
  }

  onMouseMove(mousePoint: Point): void {
    if (this.dragging) {
      var newState = this.state.onMouseDrag(mousePoint);
      this.state = newState ? newState : this.state;
    }

    this.setHovers(mousePoint);
    this.mousePoint = mousePoint;
  }

  onKeyUp(which: number): void {
    var newState = this.state.onKeyUp(which);
    this.state = newState ? newState : this.state;
    this.mousePoint && this.setHovers(this.mousePoint);
  }

  onKeyDown(which: number): void {
    var newState = this.state.onKeyDown(which);
    this.state = newState ? newState : this.state;
    this.mousePoint && this.setHovers(this.mousePoint);
  }

  onKeyPress(which: number): void {
    var newState = this.state.onKeyPress(which);
    this.state = newState ? newState : this.state;
    this.mousePoint && this.setHovers(this.mousePoint);
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
