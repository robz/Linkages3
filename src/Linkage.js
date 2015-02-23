/* @flow */

'use strict';

var Geom = require('./GeometryUtils.js');

type Point = {x: number; y: number};
type LinkageSpecType = {
  groundPoints: Object;
  points: Object;
  extenders: Object;
};

class Linkage {
  spec: LinkageSpecType;
  positions: {[key:string]: Point};

  constructor(spec) {
    this.spec = spec;
    this.positions = {};
  }

  changeSpeed(factor: number, id?: string) {
    if (!id) {
      Object.keys(this.spec.extenders).forEach((id) => {
        this.spec.extenders[id].speed *= factor;
      });
    } else {
      this.spec.extenders[id].speed *= factor;
    }
  }

  tryDraggingGroundPoint(
    currentPoint: Point, 
    hoveredPointID: string
  ): boolean {
    var groundPoint = this.spec.groundPoints[hoveredPointID];

    if (!groundPoint) {
      return false;
    }

    try {
      var {x: prevX, y: prevY} = groundPoint;
      groundPoint.x = currentPoint.x;
      groundPoint.y = currentPoint.y;
      this.calculatePositions();
      return true;
    } catch (e) {
      groundPoint.x = prevX;
      groundPoint.y = prevY;
      this.calculatePositions();
    } 

    return false;
  }

  tryRotatingLinkageInput() {
    var flag = true;
    Object.keys(this.spec.extenders).forEach((id) => {
      try {
        this.spec.extenders[id].angle += this.spec.extenders[id].speed;
        this.calculatePositions();
      } catch (e) {
        this.changeSpeed(-1, id);
        this.spec.extenders[id].angle += this.spec.extenders[id].speed;
        this.calculatePositions();
        flag = false;
      }
    });
    return flag;
  }

  tryChangingBarLength(lenChange: number, hoveredSegment: Array<{id: string}>) {
    var p0id = hoveredSegment[0].id;
    var p1id = hoveredSegment[1].id;
    var oldLen = this.spec.points[p0id][p1id].len;
    var newLen = oldLen + lenChange;

    try {
      this._changeBarLength(newLen, p0id, p1id);
      this.calculatePositions();
    } catch (e) {
      this._changeBarLength(oldLen, p0id, p1id);
      this.calculatePositions();
    } 
  }

  _changeBarLength(len: number, p0id: string, p1id: string) {
    this.spec.points[p0id][p1id].len = len;
    this.spec.points[p1id][p0id].len = len;

    var ext0 = this.spec.extenders[p0id];
    var ext1 = this.spec.extenders[p1id];

    if (ext0 && ext0.base === p1id) {
      ext0.len = len;
    } else if (ext1 && ext1.base === p0id) {
      ext1.len = len;
    } 
  }

  _addSegment(
    point0Id: string,
    point1Id: string,
    dist: number
  ) {
    if (!this.spec.points[point0Id]) {
      this.spec.points[point0Id] = {};
    }
    if (!this.spec.points[point1Id]) {
      this.spec.points[point1Id] = {};
    }
    this.spec.points[point0Id][point1Id] = {len: dist};
    this.spec.points[point1Id][point0Id] = {len: dist};
  }

  addRotaryInput(
    point1: Point,
    len: number
  ) {
    var numPoints = Object.keys(this.spec.points).length;
    var point0Id = 'p' + numPoints;
    var point1Id = 'p' + (numPoints + 1);
    var point2Id = 'p' + (numPoints + 2);

    this.spec.extenders[point2Id] = {
      base: point1Id,
      ref: point0Id,
      angle: Math.atan(4/3),
      speed: 0.04,
      len: 5,
    };
    this.spec.groundPoints[point0Id] = {x: point1.x + 1, y: point1.y};
    this.spec.groundPoints[point1Id] = {x: point1.x, y: point1.y};

    this._addSegment(point0Id, point1Id, 1);
    this._addSegment(point1Id, point2Id, 5);
  }

  addTriangle(
    point1Id: string,
    point2Id: string,
    point3: Point
  ) {
    var position1 = this.positions[point1Id];
    var position2 = this.positions[point2Id];
    var numPoints = Object.keys(this.spec.points).length;
    var point3Id = 'p' + numPoints;
    var dist1To3 = Geom.euclid(point3, this.positions[point1Id]);
    var dist2To3 = Geom.euclid(point3, this.positions[point2Id]);

    this.spec.points[point3Id] = {};

    // there are two possible solutions to a triangle--so figure out which
    // is desired based on the closest calculated third point
    var res = Geom.calcPointFromTriangle(
      position1, 
      position2, 
      dist1To3,
      dist2To3
    );

    if (Geom.euclid(res.sol1, point3) < Geom.euclid(res.sol2, point3)) {
      this._addSegment(point3Id, point1Id, dist1To3);
      this._addSegment(point3Id, point2Id, dist2To3);
    } else {
      this._addSegment(point3Id, point2Id, dist2To3);
      this._addSegment(point3Id, point1Id, dist1To3);
    }
  }

  addGroundSegment(
    groundPoint: Point,
    auxPoint: Point,
    connectedID: string
  ) {
    var numPoints = Object.keys(this.spec.points).length;
    var groundID = 'p' + numPoints;
    var auxID = 'p' + (numPoints + 1);
    
    this.spec.groundPoints[groundID] = {
      x: groundPoint.x,
      y: groundPoint.y,
    };

    var connectedPoint = this.positions[connectedID];
    var distGroundToAux = Geom.euclid(groundPoint, auxPoint); 
    var distAuxToConnected = Geom.euclid(auxPoint, connectedPoint);

    this.spec.points[groundID] = {};
    this.spec.points[groundID][auxID] = {len: distGroundToAux};

    this.spec.points[auxID] = {};

    var res = Geom.calcPointFromTriangle(
      groundPoint,
      connectedPoint, 
      distGroundToAux,
      distAuxToConnected
    );

    if (Geom.euclid(res.sol1, auxPoint) < Geom.euclid(res.sol2, auxPoint)) {
      // TODO: use _addSegment here
      this.spec.points[auxID][groundID] = {len: distGroundToAux};
      this.spec.points[auxID][connectedID] = {len: distAuxToConnected};
    } else {
      this.spec.points[auxID][connectedID] = {len: distAuxToConnected};
      this.spec.points[auxID][groundID] = {len: distGroundToAux};
    }

    this.spec.points[connectedID][auxID] = {len: distAuxToConnected};
  }

  getClosestThings(
    currentPoint: Point
  ): Object {
    var points = Object.keys(this.positions).map(id => {
      var res = this.positions[id];
      res.id = id;
      return res;
    });

    var closestPointInfo = Geom.findClosestThingToPoint(
      points,
      currentPoint,
      Geom.euclid
    );

    var closestSegmentInfo = Geom.findClosestThingToPoint(
      this._makeSegments(),
      currentPoint,
      Geom.calcMinDistFromSegmentToPoint
    );

    return {closestPointInfo, closestSegmentInfo};
  }

  _makeSegments(): Array<Array<Point>> {
    var segments = [];

    Object.keys(this.spec.points).forEach((pointID) => {
      var p0 = this.positions[pointID];
      p0.id = pointID;
      Object.keys(this.spec.points[pointID]).forEach((point2ID) => {
        var p1 = this.positions[point2ID];
        p1.id = point2ID;
        segments.push([p0, p1]);
      })
    });

    return segments;
  }

  calculatePositions() {
    var {points, extenders, groundPoints} = this.spec;
    this.positions = {};

    var idList = Object.keys(points);
    var oldLength;

    do {
      oldLength = idList.length;
      idList = idList.filter((id) => {
        if (groundPoints[id]) {
          this.positions[id] = groundPoints[id];
        } else if (
          extenders[id] && 
          this.positions[extenders[id].base] && 
          this.positions[extenders[id].ref]
        ) {
          this.positions[id] = Geom.calcPointFromExtender(
            this.positions[extenders[id].base],
            this.positions[extenders[id].ref],
            extenders[id].len,
            extenders[id].angle
          );
        } else {
          var knownAdjacents = Object.keys(points[id]).filter(
            adj => this.positions[adj]
          );

          if (knownAdjacents.length >= 2) { 
            this.positions[id] = Geom.calcPointFromTriangle(
              this.positions[knownAdjacents[0]],
              this.positions[knownAdjacents[1]],
              points[id][knownAdjacents[0]].len,
              points[id][knownAdjacents[1]].len
            ).sol1;
          }
        }

        return !this.positions[id];
      });
    } while (idList.length > 0 && idList.length < oldLength);
  }
}

module.exports = Linkage;
