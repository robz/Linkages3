var UIState = require('./UIState');

class UI {
  constructor(canvasID, linkage) {
    this.renderer = new LinkageRenderer(canvasID);
    this.state = new UIState(linkage);

    this.mousePoint = null;

    this.hoverSegmentIDs = null;
    this.hoverPointID = null;
    this.hoverPoint = false;
    this.hoverGround = false;
    this.hoverRotary = false;
  }

  animate() {
    this.state.animate(this.renderer, this.mousePoint);
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
    this.dragging = false;
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
    this.mousePoint = e;

    if (this.dragging) {
      var newState = this.state.onMouseDrag(e); 
      this.state = newState ? newState : this.state;
    } else {
      this.setHovers(e);
    }
  }

  onKeyUp(e) {
    var newState = this.state.onKeyUp(e.which);
    this.state = newState ? newState : this.state;
  }

  setHovers(e) {
    this.hoverSegmentIDs = null;
    this.hoverPointID = null;
    this.hoverPoint = false;
    this.hoverGround = false;
    this.hoverRotary = false;

    var {closestPointInfo, closestSegmentInfo} = 
      this.state.linkage.getClosestThings(e);

    if (closestPointInfo.thing) {
      this.hoverPointID = hoveredPointInfo.thing.id;
      
      if (this.state.linkage.spec.rotaries[this.hoverPointID]) {
        this.hoverRotary = true; 
      } else if (this.state.linkage.spec.groundPoints[this.hoverPointID]) {
        this.hoverGround = true; 
      } else if (this.state.linkage.spec.point[this.hoverPointID]) {
        this.hoverPoint = true; 
      }
    } else if (hoveredSegmentInfo.thing) {
      this.hoverSegmentIDs = [
        hoveredSegmentInfo.thing[0].id,
        hoveredSegmentInfo.thing[1].id
      ];
    }
  }
}
