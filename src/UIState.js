/*
 * This file contains all the UI state transitions and behaviors. Unfortunately,
 * since state transitions are inherently circular, this file cannot easily be
 * broken up into separate files because the CommonJS require system has zero
 * tolerance for circular references. To solve this, we'd need to add our own
 * require or registrar system on top of CommonJS. I'll tackle that when this
 * file reaches 1000 lines or so.
 *
 * @flow
 */
'use strict';

var Linkage = require('./Linkage');
var LinkageRenderer = require('./LinkageRenderer');
var KEYS = require('./KEYS');

var mixinPointValidation = require('./mixinPointValidation');

var MAX_TRACE_POINTS = 100;

type Point = {x: number; y: number};
type StateSpec = {
  p0id?: string;
  p1id?: string;
  pointA?: Point;
  pointB?: Point;
};

var previewOptions = {
  lineColor: 'pink',
  pointColor: 'red',
};

var _debug = false;

class BaseState {
  static getInitialUnpausedState(linkage: Linkage, debug: boolean) {
    _debug = debug;
    return new UnpausedState(linkage);
  }

  static getInitialPausedState(linkage: Linkage, debug: boolean) {
    _debug = debug;
    return new State0(linkage);
  }

  linkage: Linkage;
  p0id: ?string;
  p1id: ?string;
  pointA: ?Point;
  pointB: ?Point;

  constructor(linkage: Linkage, spec?: ?StateSpec) {
    if (_debug) {
      // state transition debugging
      console.log(new Error().stack);
    }

    this.linkage = linkage;

    if (spec) {
      this.p0id = spec.p0id;
      this.p1id = spec.p1id;
      this.pointA = spec.pointA;
      this.pointB = spec.pointB;
    }
  }

  draw(renderer: LinkageRenderer, mousePoint: Point): void {
    renderer.drawLinkage({
      positions: this.linkage.positions,
      points: this.linkage.spec.points,
    });
  }

  // Basic handlers
  onMouseDrag(point: Point): ?BaseState {}
  onMouseDown(): ?BaseState {}
  onMouseUp(mousePoint: Point): ?BaseState {}
  onKeyPress(key: number): ?BaseState {}
  onKeyDown(key: number): ?BaseState {}
  onKeyUp(key: number): ?BaseState {}

  // UI element-specific hanlders (convenience)
  onGroundDown(p0id: string): ?BaseState {}
  onRotaryDown(p0id: string): ?BaseState {}
  onAnyPointUp(p0id: string): ?BaseState {}
  onPointUp(p0id: string): ?BaseState {}
  onSegmentUp(p0id: string, p1id: string): ?BaseState {}
  onCanvasUp(pointA: Point): ?BaseState {}
}

class UnpausedState extends BaseState {  // initial unpaused
  draw(renderer: LinkageRenderer, mousePoint: Point): void {
    this.linkage.tryRotatingLinkageInput();
    super.draw(renderer, mousePoint);
  }

  onKeyUp(key: number): ?BaseState {
    switch (key) {
      case KEYS.SPACE:
        return new State0(this.linkage);
      default:
        return this;
    }
  }

  onKeyPress(key: number): ?BaseState {
    switch (key) {
      case KEYS.S:
      case KEYS.s:
        this.linkage.changeSpeed(0.9);
        return this;
      case KEYS.W:
      case KEYS.w:
        this.linkage.changeSpeed(1.1);
        return this;
      case KEYS.T:
      case KEYS.t:
        this.linkage.changeSpeed(-1);
        return this;
      default:
        return this;
    }
  }
}

class State10 extends UnpausedState { // rotary selected moving
  draw(renderer: LinkageRenderer, mousePoint: Point): void {
    super.draw(renderer, mousePoint);

    var p1id = this.linkage.spec.rotaries[this.p0id];
    var p2id = this.linkage.spec.extenders[p1id].ref;
    renderer.drawLines(
      [
        this.linkage.getPoint(p1id),
        this.linkage.getPoint(this.p0id),
        this.linkage.getPoint(p2id),
      ],
      previewOptions
    );
  }

  onKeyPress(key: number): ?BaseState {
    switch (key) {
      case KEYS.S:
      case KEYS.s:
        this.linkage.changeSpeed(0.9, this.p0id);
        return this;
      case KEYS.W:
      case KEYS.w:
        this.linkage.changeSpeed(1.1, this.p0id);
        return this;
      case KEYS.T:
      case KEYS.t:
        this.linkage.changeSpeed(-1, this.p0id);
        return this;
      default:
        return this;
    }
  }
}

class State12 extends UnpausedState { // trace point
  tracePoints: Array<Point>;

  constructor(linkage: Linkage, spec: StateSpec) {
    super(linkage, spec);
    this.tracePoints = [];
  }

  draw(renderer: LinkageRenderer, mousePoint: Point): void {
    super.draw(renderer, mousePoint);

    // record the current position
    var curPoint = this.linkage.positions[this.p0id];
    this.tracePoints.push({
      x: curPoint.x,
      y: curPoint.y,
    });
    if (this.tracePoints.length > MAX_TRACE_POINTS) {
      this.tracePoints.shift();
    }

    renderer.drawLines2(this.tracePoints, previewOptions);
    renderer.drawPoint(curPoint, previewOptions);
  }
}

class PausedState extends BaseState {
  onKeyUp(key: number): ?BaseState {
    switch (key) {
      case KEYS.SPACE:
        return new UnpausedState(this.linkage);
      case KEYS.ESC:
        return new State0(this.linkage);
      default:
        return this;
    }
  }
}

class State0 extends PausedState { // initial paused
  onGroundDown(p0id: string): ?BaseState {
    return new State3(this.linkage, {p0id});
  }

  onRotaryDown(p0id: string): ?BaseState {
    return new State7(this.linkage, {p0id});
  }

  onPointUp(p0id: string): ?BaseState {
    return new State4(this.linkage, {p0id});
  }

  onSegmentUp(p0id: string, p1id: string): ?BaseState {
    return new State9(this.linkage, {p0id, p1id});
  }

  onCanvasUp(pointA: Point): ?BaseState {
    return new State1(this.linkage, {pointA});
  }

  onKeyDown(key: number): ?BaseState {
    switch (key) {
      case KEYS.R:
      case KEYS.r:
        return new State11(this.linkage);
      default:
        return this;
    }
  }
}

class State11 extends PausedState { // rotary hover
  onKeyUp(key: number): ?BaseState {
    switch (key) {
      case KEYS.R:
      case KEYS.r:
        return new State0(this.linkage);
      default:
        return super.onKeyUp(key);
    }
  }

  onMouseUp(mousePoint: Point): ?BaseState {
    this.linkage.addRotaryInput(mousePoint);
    this.linkage.calculatePositions();
    return new State0(this.linkage);
  }

  draw(renderer: LinkageRenderer, mousePoint: Point): void {
    super.draw(renderer, mousePoint);

    renderer.drawLines(
      [
        {x: mousePoint.x + 3, y: mousePoint.y + 4},
        mousePoint,
        {x: mousePoint.x + 1, y: mousePoint.y},
      ],
      previewOptions
    );
  }
}

class State1 extends PausedState { // canvas1
  constructor(linkage: Linkage, spec: StateSpec) {
    super(linkage, spec);

    mixinPointValidation(
      [this.pointA],
      ['onCanvasUp', 'onAnyPointUp'],
      this
    );
  }

  onCanvasUp(pointB: Point): ?BaseState {
    return new State2(this.linkage, {pointA: this.pointA, pointB});
  }

  onAnyPointUp(p0id: string): ?BaseState {
    return new State13(this.linkage, {pointA: this.pointA, p0id});
  }

  draw(renderer: LinkageRenderer, mousePoint: Point): void {
    super.draw(renderer, mousePoint);
    renderer.drawLines([this.pointA, mousePoint], previewOptions);
  }
}

class State13 extends PausedState { // canvas then point
  constructor(linkage: Linkage, spec: StateSpec) {
    super(linkage, spec);

    mixinPointValidation(
      [this.pointA, this.linkage.getPoint(this.p0id)],
      ['onCanvasUp'],
      this
    );
  }

  onCanvasUp(pointB: Point): ?BaseState {
    this.linkage.addGroundSegment(this.pointA, pointB, this.p0id);
    this.linkage.calculatePositions();
    return new State0(this.linkage);
  }

  draw(renderer: LinkageRenderer, mousePoint: Point): void {
    super.draw(renderer, mousePoint);
    renderer.drawLines(
      [
        this.pointA,
        mousePoint,
        this.linkage.getPoint(this.p0id),
      ],
      previewOptions
    );
  }
}

class State2 extends PausedState { // canvas1 + canvas2
  constructor(linkage: Linkage, spec: StateSpec) {
    super(linkage, spec);

    mixinPointValidation(
      [this.pointB],
      ['onAnyPointUp'],
      this
    );
  }

  onAnyPointUp(p0id: string): ?BaseState {
    this.linkage.addGroundSegment(this.pointA, this.pointB, p0id);
    this.linkage.calculatePositions();
    return new State0(this.linkage);
  }

  draw(renderer: LinkageRenderer, mousePoint: Point): void {
    super.draw(renderer, mousePoint);
    renderer.drawLines([this.pointA, this.pointB], previewOptions);
    renderer.drawLines([this.pointB, mousePoint], previewOptions);
  }
}

class State3 extends PausedState { // ground down
  dragged: ?boolean;

  onMouseUp(mousePoint: Point): ?BaseState {
    return this.dragged ?
      new State0(this.linkage) :
      new State4(this.linkage, {p0id: this.p0id});
  }

  onMouseDrag(point: Point): ?BaseState {
    this.dragged = true;
    this.linkage.tryMovingGroundPoints([{point, id:this.p0id}]);
    return this;
  }
}

class State4 extends PausedState { // point1
  constructor(linkage: Linkage, spec: StateSpec) {
    super(linkage, spec);

    mixinPointValidation(
      [this.linkage.getPoint(this.p0id)],
      ['onAnyPointUp', 'onCanvasUp'],
      this
    );
  }

  onAnyPointUp(p1id: string): ?BaseState {
    return new State5(this.linkage, {p0id: this.p0id, p1id})
  }

  onCanvasUp(pointA: Point): ?BaseState {
    return new State6(this.linkage, {p0id: this.p0id, pointA})
  }

  onKeyUp(key: number): ?BaseState {
    switch (key) {
      case KEYS.D:
      case KEYS.d:
        if (this.linkage.tryRemovingPoint(this.p0id)) {
          return new State0(this.linkage);
        } else {
          return this;
        }
      case KEYS.SPACE:
        return new State12(this.linkage, {p0id: this.p0id});
      default:
        return super.onKeyUp(key);
    }
  }

  draw(renderer: LinkageRenderer, mousePoint: Point): void {
    super.draw(renderer, mousePoint);
    renderer.drawLines(
      [
        this.linkage.getPoint(this.p0id),
        mousePoint,
      ],
      previewOptions
    );
  }
}

class State5 extends PausedState { // point2
  constructor(linkage: Linkage, spec: StateSpec) {
    super(linkage, spec);

    mixinPointValidation(
      [this.linkage.getPoint(this.p0id), this.linkage.getPoint(this.p1id)],
      ['onCanvasUp'],
      this
    );
  }

  onCanvasUp(pointA: Point): ?BaseState {
    this.linkage.addTriangle(this.p0id, this.p1id, pointA);
    this.linkage.calculatePositions();
    return new State0(this.linkage);
  }

  draw(renderer: LinkageRenderer, mousePoint: Point): void {
    super.draw(renderer, mousePoint);
    renderer.drawLines(
      [
        this.linkage.getPoint(this.p0id),
        mousePoint,
        this.linkage.getPoint(this.p1id),
      ],
      previewOptions
    );
  }
}

class State6 extends PausedState { // point1 + canvas1
  constructor(linkage: Linkage, spec: StateSpec) {
    super(linkage, spec);

    mixinPointValidation(
      [this.pointA, this.linkage.getPoint(this.p0id)],
      ['onCanvasUp', 'onAnyPointUp'],
      this
    );
  }

  onCanvasUp(pointB: Point): ?BaseState {
    this.linkage.addGroundSegment(pointB, this.pointA, this.p0id);
    this.linkage.calculatePositions();
    return new State0(this.linkage);
  }

  onAnyPointUp(p1id: string): ?BaseState {
    this.linkage.addTriangle(this.p0id, p1id, this.pointA);
    this.linkage.calculatePositions();
    return new State0(this.linkage);
  }

  draw(renderer: LinkageRenderer, mousePoint: Point): void {
    super.draw(renderer, mousePoint);
    renderer.drawLines(
      [
        this.linkage.getPoint(this.p0id),
        this.pointA,
        mousePoint,
      ],
      previewOptions
    );
  }
}

class State7 extends PausedState { // rotary down
  dragged: ?boolean;

  onMouseUp(mousePoint: Point): ?BaseState {
    return this.dragged ?
      new State0(this.linkage) :
      new State8(this.linkage, {p0id: this.p0id});
  }

  onMouseDrag(point: Point): ?BaseState {
    this.dragged = true;

    var {rotaries, extenders, groundPoints} = this.linkage.spec;

    var {x: prevX, y: prevY} = groundPoints[this.p0id];
    var refID = extenders[rotaries[this.p0id]].ref;
    var refCurPoint = groundPoints[refID];
    var refNextPoint = {
      x: refCurPoint.x + point.x - prevX,
      y: refCurPoint.y + point.y - prevY,
    };

    this.linkage.tryMovingGroundPoints([
      {point, id: this.p0id},
      {point: refNextPoint, id: refID},
    ]);

    return this;
  }
}

class State8 extends State0 { // rotary selected
  onKeyUp(key: number): ?BaseState {
    switch (key) {
      case KEYS.SPACE:
        return new State10(this.linkage, {p0id: this.p0id});
      case KEYS.d:
      case KEYS.D:
        if (this.linkage.tryRemovingPoint(this.p0id)) {
          return new State0(this.linkage);
        } else {
          return this;
        }
      default:
        return super.onKeyUp(key);
    }
  }

  draw(renderer: LinkageRenderer, mousePoint: Point): void {
    super.draw(renderer, mousePoint);
    var p1id = this.linkage.spec.rotaries[this.p0id];
    var p2id = this.linkage.spec.extenders[p1id].ref;
    renderer.drawLines(
      [
        this.linkage.getPoint(p1id),
        this.linkage.getPoint(this.p0id),
        this.linkage.getPoint(p2id),
      ],
      previewOptions
    );
  }
}

class State9 extends PausedState { // segment selected
  constructor(linkage: Linkage, spec: StateSpec) {
    super(linkage, spec);

    mixinPointValidation(
      [this.linkage.getPoint(this.p0id), this.linkage.getPoint(this.p1id)],
      ['onCanvasUp'],
      this
    );
  }

  onCanvasUp(pointA: Point): ?BaseState {
    this.linkage.addTriangle(this.p0id, this.p1id, pointA);
    this.linkage.calculatePositions();
    return new State0(this.linkage);
  }

  onKeyPress(key: number): ?BaseState {
    switch (key) {
      case KEYS.S:
      case KEYS.s:
        this.linkage.tryChangingBarLength(-1, this.p0id, this.p1id);
        return this;
      case KEYS.W:
      case KEYS.w:
        this.linkage.tryChangingBarLength(1, this.p0id, this.p1id);
        return this;
      default:
        return super.onKeyPress(key);
    }
  }

  draw(renderer: LinkageRenderer, mousePoint: Point): void {
    super.draw(renderer, mousePoint);
    renderer.drawLines(
      [
        this.linkage.getPoint(this.p0id),
        mousePoint,
        this.linkage.getPoint(this.p1id),
      ],
      previewOptions
    );
  }
}

module.exports = BaseState;
