var UIState = require('./UIState');

class UI {
  constructor(linkage) {
    this.state = new UIState(linkage);

    this.hoverPointID = null;
    this.hoverPoint = null;
    this.hoverGround = null;
    this.hoverRotary = null;
  }

  onMouseDown(e) {
    this.dragging = true;
    
    if (this.hoverRotary) {
      newState = this.state.onRotaryDown(this.hoverPointID);
    } else if (this.hoverGround) {
      newState = this.state.onGroundDown(this.hoverPointID);
    }

    this.state = newState ? newState : this.state;
  }

  onMouseUp(e) {
    var newState = null;

    var newState = this.state.onMouseUp();

    if (!newState && this.hoverPointID) {
      newState = this.state.onAnyPointUp(this.hoverPointID);
    } 

    if (!newState) {
      if (this.hoverSegmentIDs) {
        newState = this.state.onSegmentUp(...this.hoverSegmentIDs);
      } else if (this.hoverGround || this.hoverRotary) {
        newState = this.state.onGroundUp(this.hoverPointID);
      } else if (this.hoverPoint) {
        newState = this.state.onPointUp(this.hoverPointID);
      } else {
        newState = this.state.onCanvasUp(this.hoverPointID);
      }
    }

    this.state = newState ? newState : this.state;
  }
  
  onMouseMove(e) {
    if (this.dragging) {
      var newState = this.state.onMouseDrag(e); 
      this.state = newState ? newState : this.state;
    } else {
      this.setNewHoverables(e);
    }
  }

  setNewHoverables(e) {
    // find closest point or segment
    // if point, find what kind it is
  }

  onKeyUp(e) {
    var newState = this.state.onKeyUp(e.which);
    this.state = newState ? newState : this.state;
  }
}
