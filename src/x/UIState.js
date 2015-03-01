var KEYS = require('./KEYS');

class BaseState {
  constructor(linkage, {p0id, p1id, pointA, pointB, selectedRotary}) {
    this.linkage = linkage;
    this.p0id = p0id;
    this.p1id = p1id;
    this.pointA = pointA; 
    this.pointB = pointB; 
    this.selectedRotary = selectedRotary;
  }

  onAnyPointUp() {}
  onCanvasUp(pointA) {}
  onGroundDown(p0id) {}
  onMouseDrag(point) {}
  onMouseUp() {}
  onPointUp(p0id) {}
  onRotaryDown(p0id) {}
  onSegmentUp(p0id, p1id) {}

  draw(renderer) {
    renderer.drawLinkage(this.linkage.spec);
  }

  onKeyUp(key) {
    switch (key) {
      case KEYS.SPACE:
        return new State10(this.linkage);
      default:
        return this;  
    }
  }
}

class State10 extends BaseState { // initial unpaused
  draw(ctx, renderer) {
    super.draw(ctx, renderer);    

    // if we have a selected rotary
    if (this.p0id) {
      // draw selected rotary in red
    }
  }

  onKeyUp(key) {
    switch (key) {
      case KEYS.DOWN:
        this.linkage.changeSpeed(0.9, this.p0id);
        break;
      case KEYS.UP:
        this.linkage.changeSpeed(1.1, this.p0id);
        break;
      case KEYS.SPACE:
        return new State0(this.linkage);
    }

    return this;
  }
}

class State0 extends BaseState { // initial paused
  onCanvasUp(pointA) {      return new State1(this.linkage, {pointA}) }
  onGroundDown(p0id) {      return new State3(this.linkage, {p0id}) }
  onPointUp(p0id) {         return new State4(this.linkage, {p0id}) }
  onRotaryDown(p0id) {      return new State7(this.linkage, {p0id}) }
  onSegmentUp(p0id, p1id) { return new State9(this.linkage, {p0id, p1id}) }

  onKeyUp(key) {
    switch (key) {
      case KEYS.ESC:
        return new State0(this.linkage);
        break;
      case KEYS.SPACE:
        return new State10(this.linkage);
      default:
        return this;
    }
  }
}

class State1 extends BaseState { // canvas1
  onCanvasUp(pointB) { return new State1(this.linkage, {pointA: this.pointA, pointB}) } 

  draw(ctx, renderer, mousePoint) {
    super.draw(ctx, renderer);
    // draw line from this.pointA to mousePoint  
  }
}

class State2 extends BaseState { // canvas1 + canvas2
  onAnyPointUp(p0id) {
    this.linkage.addGroundSegment(this.pointA, this.pointB, p0id);
    return new State0(this.linkage);
  }

  draw(ctx, renderer, mousePoint) {
    super.draw(ctx, renderer);
    // draw pointA to pointB to mousePoint  
  }
}

class State3 extends BaseState { // ground down
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

class State4 extends BaseState { // point1
  onAnyPointUp(p1id) { return new State5(this.linkage, {p0id: this.p0id, p1id}) }
  onCanvasUp(pointA) { return new State6(this.linkage, {p0id: this.p0id, pointA}) }

  draw(ctx, renderer, mousePoint) {
    super.draw(ctx, renderer);
    // draw p0id to mousePoint
  }
}

class State5 extends BaseState { // point2
  onCanvasUp(pointA) {
    this.linkage.addTriangle(this.p0id, this.p1id, pointA);
    return new State0(this.linkage);
  }

  draw(ctx, renderer, mousePoint) {
    super.draw(ctx, renderer);
    // draw p0id to p1id to mousePoint
  }
}

class State6 extends BaseState { // point1 + canvas1
  onCanvasUp(pointB) {
    this.linkage.addGroundSegment(this.pointA, this.pointB, p0id);
    return new State0(this.linkage);
  }

  onAnyPointUp(p1id) {
    this.linkage.addTriangle(this.p0id, this.p1id, pointA);
    return new State0(this.linkage);
  }

  draw(ctx, renderer, mousePoint) {
    super.draw(ctx, renderer);
    // draw p0id to pointA to mousePoint
  }
}

class State7 extends BaseState { // rotary down
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

class State8 extends BaseState { // rotary selected 
  onKeyUp(key) {
    switch (key) {
      case KEYS.SPACE:
        return new State10(this.linkage, {p0id: this.p0id});
      default: 
        return super.onKeyUp(key);
    }
  }

  draw(ctx, renderer, mousePoint) {
    super.draw(ctx, renderer);
    // draw rotary
  }
}

class State9 extends BaseState { // segment selected
  onCanvasUp(pointA) {
    this.linkage.addTriangle(this.p0id, this.p1id, pointA);
    return new State0(this.linkage);
  }

  onKeyUp(key) {
    switch (key) {
      case KEYS.DOWN:
        this.linkage.tryChangingBarLength(-1, [this.p0id, this.p1id]);
        return this;
      case KEYS.UP:
        this.linkage.tryChangingBarLength(1, [this.p0id, this.p1id]);
        return this;
      default:
        return super.onKeyUp(key);
    }
  }

  draw(ctx, renderer, mousePoint) {
    super.draw(ctx, renderer);
    // draw p0id to p1id to mousePoint
  }
}

module.exports = State0;
