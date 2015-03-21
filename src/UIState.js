var KEYS = require('./KEYS');

var ghostOptions = {
  lineColor: 'pink',
  pointColor: 'red',
};

class BaseState {
  constructor(linkage, spec) {
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

  draw(renderer) {
    renderer.drawLinkage({
      positions: this.linkage.positions,
      points: this.linkage.spec.points,
    });
  }

  onGroundDown(p0id) {}
  onRotaryDown(p0id) {}
  onAnyPointUp(p0id) {}
  onPointUp(p0id) {}
  onSegmentUp(p0id, p1id) {}
  onCanvasUp(pointA) {}

  onMouseDrag(point) {}
  onMouseDown() {}
  onMouseUp() {}
  onKeyPress(key) {}
  onKeyDown(key) {}
  onKeyUp(key) {}
}

class State10 extends BaseState { // initial unpaused
  draw(renderer) {
    this.linkage.tryRotatingLinkageInput();
    super.draw(renderer);

    if (this.p0id) {
      // TODO: draw rotary
      renderer.drawPoint(this.linkage.positions[this.p0id], {pointColor: 'red'});
    }
  }

  onKeyPress(key) {
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

  onKeyUp(key) {
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
  onKeyUp(key) {
    switch (key) {
      case KEYS.SPACE:
        return new State10(this.linkage);
      default:
        return this;
    }
  }
}

class State0 extends PausedState { // initial paused
  onGroundDown(p0id) {      return new State3(this.linkage, {p0id}) }
  onRotaryDown(p0id) {      return new State7(this.linkage, {p0id}) }
  onPointUp(p0id) {         return new State4(this.linkage, {p0id}) }
  onSegmentUp(p0id, p1id) { return new State9(this.linkage, {p0id, p1id}) }
  onCanvasUp(pointA) {      return new State1(this.linkage, {pointA}) }

  onKeyDown(key) {
    console.log(key);
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
  onKeyUp(key) {
    switch (key) {
      case KEYS.R:
      case KEYS.r:
        return new State0(this.linkage);
      default:
        return super.onKeyUp(key);
    }
  }

  onMouseUp(mousePoint) {
    this.linkage.addRotaryInput(mousePoint);
    return new State0(this.linkage);
  }

  draw(renderer, mousePoint) {
    super.draw(renderer);
    renderer.drawLines(
      {x: mousePoint.x + 3, y: mousePoint.y + 4},
      mousePoint,
      {x: mousePoint.x + 1, y: mousePoint.y},
      ghostOptions
    );
  }
}

class State1 extends PausedState { // canvas1
  onCanvasUp(pointB) { return new State2(this.linkage, {pointA: this.pointA, pointB}) }

  draw(renderer, mousePoint) {
    super.draw(renderer);
    renderer.drawLines(this.pointA, mousePoint, ghostOptions);
  }
}

class State2 extends PausedState { // canvas1 + canvas2
  onAnyPointUp(p0id) {
    this.linkage.addGroundSegment(this.pointA, this.pointB, p0id);
    return new State0(this.linkage);
  }

  draw(renderer, mousePoint) {
    super.draw(renderer);
    renderer.drawLines(this.pointA, this.pointB, ghostOptions);
    renderer.drawLines(this.pointB, mousePoint, ghostOptions);
  }
}

class State3 extends PausedState { // ground down
  onMouseUp() {
    return this.dragged ?
      new State0(this.linkage) :
      new State4(this.linkage, {p0id: this.p0id});
  }

  onMouseDrag(point) {
    this.dragged = true;
    this.linkage.tryDraggingGroundPoint(point, this.p0id);
    return this;
  }
}

class State4 extends PausedState { // point1
  onAnyPointUp(p1id) { return new State5(this.linkage, {p0id: this.p0id, p1id}) }
  onCanvasUp(pointA) { return new State6(this.linkage, {p0id: this.p0id, pointA}) }

  draw(renderer, mousePoint) {
    super.draw(renderer);
    renderer.drawLines(
      this.linkage.positions[this.p0id],
      mousePoint,
      ghostOptions
    );
  }
}

class State5 extends PausedState { // point2
  onCanvasUp(pointA) {
    this.linkage.addTriangle(this.p0id, this.p1id, pointA);
    return new State0(this.linkage);
  }

  draw(renderer, mousePoint) {
    super.draw(renderer);
    renderer.drawLines(
      this.linkage.positions[this.p0id],
      this.linkage.positions[this.p1id],
      mousePoint,
      ghostOptions
    );
  }
}

class State6 extends PausedState { // point1 + canvas1
  onCanvasUp(pointB) {
    this.linkage.addGroundSegment(pointB, this.pointA, this.p0id);
    return new State0(this.linkage);
  }

  onAnyPointUp(p1id) {
    this.linkage.addTriangle(this.p0id, p1id, this.pointA);
    return new State0(this.linkage);
  }

  draw(renderer, mousePoint) {
    super.draw(renderer);
    renderer.drawLines(
      this.linkage.positions[this.p0id],
      this.pointA,
      mousePoint,
      ghostOptions
    );
  }
}

class State7 extends PausedState { // rotary down
  onMouseUp() {
    return this.dragged ?
      new State0(this.linkage) :
      new State8(this.linkage, {p0id: this.p0id});
  }

  onMouseDrag(point) {
    this.dragged = true;
    this.linkage.tryDraggingGroundPoint(point, this.p0id);
    return this;
  }
}

class State8 extends PausedState { // rotary selected
  onKeyUp(key) {
    switch (key) {
      case KEYS.SPACE:
        return new State10(this.linkage, {p0id: this.p0id});
      default:
        return super.onKeyUp(key);
    }
  }

  draw(renderer, mousePoint) {
    super.draw(renderer);
    // TODO: draw rotary
  }
}

class State9 extends PausedState { // segment selected
  onCanvasUp(pointA) {
    this.linkage.addTriangle(this.p0id, this.p1id, pointA);
    return new State0(this.linkage);
  }

  onKeyPress(key) {
    switch (key) {
      case KEYS.S:
      case KEYS.s:
        this.linkage.tryChangingBarLength(-1, [{id:this.p0id}, {id:this.p1id}]);
        return this;
      case KEYS.W:
      case KEYS.w:
        this.linkage.tryChangingBarLength(1, [{id:this.p0id}, {id:this.p1id}]);
        return this;
      default:
        return super.onKeyPress(key);
    }
  }

  draw(renderer, mousePoint) {
    super.draw(renderer);
    renderer.drawLines(
      this.linkage.positions[this.p0id],
      mousePoint,
      this.linkage.positions[this.p1id],
      ghostOptions
    );
  }
}

module.exports = State10;
