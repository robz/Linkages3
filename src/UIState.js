/*@flow*/
'use strict';

var Linkage = require('./Linkage');
var LinkageRenderer = require('./LinkageRenderer');

var KEYS = require('./KEYS');

type Point = {x: number; y: number};
type StateSpec = {
  p0id: ?string;
  p1id: ?string;
  pointA: ?Point;
  pointB: ?Point;
};

var options = {
  lineColor: 'pink',
  pointColor: 'red',
};

class BaseState {
  static getInitialState(linkage: Linkage) {
    return new State10(linkage);
  }

  linkage: Linkage;
  p0id: ?string;
  p1id: ?string;
  pointA: ?Point;
  pointB: ?Point;

  constructor(linkage: Linkage, spec?: ?StateSpec) {
    // state transition debugging
    console.log(new Error().stack);

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

class State10 extends BaseState { // initial unpaused
  draw(renderer: LinkageRenderer, mousePoint: Point): void {
    this.linkage.tryRotatingLinkageInput();
    super.draw(renderer, mousePoint);

    // draw rotary if selected
    if (this.p0id) {
      var p1id = this.linkage.spec.rotaries[this.p0id];
      var p2id = this.linkage.spec.extenders[p1id].ref;
      renderer.drawLines(
        [
          this.linkage.getPoint(p1id),
          this.linkage.getPoint(this.p0id),
          this.linkage.getPoint(p2id),
        ],
        options
      );
    }
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
      default:
        return this;
    }
  }

  onKeyUp(key: number): ?BaseState {
    switch (key) {
      case KEYS.ESC:
      case KEYS.SPACE:
        return new State0(this.linkage);
      default:
        return this;
    }
  }
}

class PausedState extends BaseState {
  onKeyUp(key: number): ?BaseState {
    switch (key) {
      case KEYS.SPACE:
        return new State10(this.linkage);
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

class State11 extends PausedState {
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
      options
    );
  }
}

class State1 extends PausedState { // canvas1
  onCanvasUp(pointB: Point): ?BaseState {
    return new State2(this.linkage, {pointA: this.pointA, pointB})
  }

  draw(renderer: LinkageRenderer, mousePoint: Point): void {
    super.draw(renderer, mousePoint);
    renderer.drawLines([this.pointA, mousePoint], options);
  }
}

class State2 extends PausedState { // canvas1 + canvas2
  onAnyPointUp(p0id: string): ?BaseState {
    this.linkage.addGroundSegment(this.pointA, this.pointB, p0id);
    return new State0(this.linkage);
  }

  draw(renderer: LinkageRenderer, mousePoint: Point): void {
    super.draw(renderer, mousePoint);
    renderer.drawLines([this.pointA, this.pointB], options);
    renderer.drawLines([this.pointB, mousePoint], options);
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
    this.linkage.tryDraggingGroundPoint(point, this.p0id);
    return this;
  }
}

class State4 extends PausedState { // point1
  onAnyPointUp(p1id: string): ?BaseState {
    return new State5(this.linkage, {p0id: this.p0id, p1id})
  }

  onCanvasUp(pointA: Point): ?BaseState {
    return new State6(this.linkage, {p0id: this.p0id, pointA})
  }

  draw(renderer: LinkageRenderer, mousePoint: Point): void {
    super.draw(renderer, mousePoint);
    renderer.drawLines(
      [
        this.linkage.getPoint(this.p0id),
        mousePoint,
      ],
      options
    );
  }
}

class State5 extends PausedState { // point2
  onCanvasUp(pointA: Point): ?BaseState {
    this.linkage.addTriangle(this.p0id, this.p1id, pointA);
    return new State0(this.linkage);
  }

  draw(renderer: LinkageRenderer, mousePoint: Point): void {
    super.draw(renderer, mousePoint);
    renderer.drawLines(
      [
        this.linkage.getPoint(this.p0id),
        this.linkage.getPoint(this.p1id),
        mousePoint,
      ],
      options
    );
  }
}

class State6 extends PausedState { // point1 + canvas1
  onCanvasUp(pointB: Point): ?BaseState {
    this.linkage.addGroundSegment(pointB, this.pointA, this.p0id);
    return new State0(this.linkage);
  }

  onAnyPointUp(p1id: string): ?BaseState {
    this.linkage.addTriangle(this.p0id, p1id, this.pointA);
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
      options
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
    this.linkage.tryDraggingGroundPoint(point, this.p0id);
    return this;
  }
}

class State8 extends PausedState { // rotary selected
  onKeyUp(key: number): ?BaseState {
    switch (key) {
      case KEYS.SPACE:
        return new State10(this.linkage, {p0id: this.p0id});
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
      options
    );
  }
}

class State9 extends PausedState { // segment selected
  onCanvasUp(pointA: Point): ?BaseState {
    this.linkage.addTriangle(this.p0id, this.p1id, pointA);
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
      options
    );
  }
}

module.exports = BaseState;
