var UIState = require('./UIState');
var LinkageRenderer = require('../LinkageRenderer');

class UI {
  constructor(canvasID, linkage) {
    this.renderer = new LinkageRenderer(canvasID);
    linkage.calculatePositions();
    this.state = new UIState(linkage);

    this.mousePoint = null;

    this.hoverSegmentIDs = null;
    this.hoverPointID = null;
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

  animate() {
    this.state.linkage.calculatePositions();
    this.state.draw(this.renderer, this.mousePoint);
    window.requestAnimationFrame(this.animate.bind(this));
  }

  onMouseDown(e) {
    this.dragging = true;
    var newState = null;

    if (this.hoverRotary) {
      newState = this.state.onRotaryDown(this.hoverPointID);
    } else if (this.hoverGround) {
      newState = this.state.onGroundDown(this.hoverPointID);
    }

    this.state = newState ? newState : this.state;
  }

  onMouseUp(e) {
    this.dragging = false;

    var newState = this.state.onMouseUp();

    if (!newState && this.hoverPointID) {
      newState = this.state.onAnyPointUp(this.hoverPointID);
    }

    if (!newState) {
      if (this.hoverSegmentIDs) {
        newState = this.state.onSegmentUp(...this.hoverSegmentIDs);
      } else if (this.hoverPoint || this.hoverGround || this.hoverRotary) {
        newState = this.state.onPointUp(this.hoverPointID);
      } else {
        newState = this.state.onCanvasUp(this.renderer.inverseTransform(e));
      }
    }

    this.state = newState ? newState : this.state;
  }

  onMouseMove(e) {
    this.mousePoint = this.renderer.inverseTransform(e);

    if (this.dragging) {
      var newState = this.state.onMouseDrag(this.mousePoint);
      this.state = newState ? newState : this.state;
    } else {
      this.setHovers(this.mousePoint);
    }
  }

  onKeyUp(e) {
    var newState = this.state.onKeyUp(e.which);
    this.state = newState ? newState : this.state;
  }

  onKeyDown(e) {
    var newState = this.state.onKeyDown(e.which);
    this.state = newState ? newState : this.state;
  }

  onKeyPress(e) {
    var newState = this.state.onKeyPress(e.which);
    this.state = newState ? newState : this.state;
  }

  setHovers(currentPoint) {
    this.hoverSegmentIDs = null;
    this.hoverPointID = null;
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
