/* @flow */
'use strict';

var Geom = require('./math/GeometryUtils');
var smallestNumberDivisibleBy = require('./math/smallestNumberDivisibleBy');

type Point = {x: number; y: number};
type LinkageSpecType = {
  groundPoints: {[key:string]: Point};
  points: Object;
  extenders: Object;
  rotaries: Object;
};

class Linkage {
  spec: LinkageSpecType;
  positions: {[key:string]: Point};
  speed: number;

  constructor(spec: LinkageSpecType) {
    this.spec = spec;
    this.positions = {};
    this.speed = 1/20;
  }

  scaleSpeed(scale: number) {
    if (scale <= 0) {
      throw new Error('can only scale speed by position amount');
    }

    this.speed *= scale;
  }

  getPath(id: string): ?Array<Point> {
    var extenders = this.spec.extenders;

    // save current state
    var oldInputs = Object.keys(extenders).map(id => {
      return {
        id,
        angle: extenders[id].angle,
      };
    });

    var speeds = Object.keys(extenders).map(extID => extenders[extID].speed);
    var numRotations = smallestNumberDivisibleBy(speeds);

    var size = Math.abs(Math.PI*2/this.speed);
    var path = [];
    for (var i = 0; i < size * numRotations; i++) {
      var success = this.tryRotatingLinkageInput();
      if (!success) {
        path = null;
        break;
      }
      path.push(this.getPoint(id));
    }

    // restore old state
    oldInputs.forEach(o => {
      extenders[o.id].angle = o.angle;
    });
    this.calculatePositions();

    return path;
  }

  _deletePointFromSpec(spec: LinkageSpecType, id: string): void {
    delete spec.groundPoints[id];
    delete spec.points[id];
    delete spec.rotaries[id];
    delete spec.extenders[id];
  }

  tryRemovingPoint(id: ?string): boolean {
    if (!id) {
      throw new Error('id must be defined');
    }

    // remove point from spec, all adjacents that are not connected to anything
    var newSpec = JSON.parse(JSON.stringify(this.spec));
    var adjacentPoints = Object.keys(newSpec.points[id]);
    adjacentPoints.forEach(adjID => {
      delete newSpec.points[adjID][id];
      if (Object.keys(newSpec.points[adjID]).length === 0) {
        this._deletePointFromSpec(newSpec, adjID);
      }
    });
    this._deletePointFromSpec(newSpec, id);

    try {
      var newPositions = this._calculatePositionsAux(newSpec);
    } catch (e) {
      return false;
    }

    this.positions = newPositions;
    this.spec = newSpec;
    return true;
  }

  getPoint(id: ?string): Point {
    if (!id) {
      throw new Error('id must be defined');
    }

    return this.positions[id];
  }

  reverseRotary(rotID?: string) {
    if (!rotID) {
      // if an id was not provided, apply reversal to all rotaries
      Object.keys(this.spec.extenders).forEach(id => {
        this.spec.extenders[id].speed *= -1;
      });
    } else {
      // otherwise just apply reversal to the provided rotary
      var extID = this.spec.rotaries[rotID];
      this.spec.extenders[extID].speed *= -1;
    }
  }

  _changeRotarySpeed(difference: number, extID: string) {
    var currentSpeed = this.spec.extenders[extID].speed;

    if (currentSpeed === 0) {
      throw new Error('rotary cannot be at zero speed!');
    }

    this.spec.extenders[extID].speed += difference;

    if (this.spec.extenders[extID].speed === 0) {
      // right now I don't allow zero-speed rotaries,
      // so apply difference twice to prevent that
      this.spec.extenders[extID].speed += difference;
    }
  }

  changeSpeed(difference: number, rotID?: string) {
    if (difference !== 1 && difference !== -1) {
      throw new Error('difference not supported:' + difference);
    }

    if (!rotID) {
      // if an id was not provided, apply changes to all rotaries
      Object.keys(this.spec.extenders).forEach(id => {
        this._changeRotarySpeed(difference, id);
      });
    } else {
      // otherwise just apply difference to the provided rotary
      var extID = this.spec.rotaries[rotID];
      this._changeRotarySpeed(difference, extID);
    }
  }

  moveNotGroundPoint(
    newPos: Point,
    p0id: string
  ): void {
    if (this.spec.extenders[p0id]) {
      var basePoint = this.positions[this.spec.extenders[p0id].base];
      var refPoint = this.positions[this.spec.extenders[p0id].ref];
      var newDist = Geom.euclid(newPos, basePoint);
      this.spec.extenders[p0id].len = newDist;
      this.spec.extenders[p0id].angle = Math.atan2(
        newPos.y - basePoint.y,
        newPos.x - basePoint.x
      ) - Math.atan2(
        refPoint.y - basePoint.y,
        refPoint.x - basePoint.x
      );
    }

    Object.keys(this.spec.points[p0id]).forEach(p1id => {
      var newDist = Geom.euclid(newPos, this.positions[p1id]);
      this.spec.points[p0id][p1id].len = newDist;
      this.spec.points[p1id][p0id].len = newDist;
    });

    if (!this.calculatePositions()) {
      throw new Error('wat');
    }
  }

  tryMovingGroundPoints(
    points: Array<{point: Point; id: string}>
  ) {
    var prevPoints = {};

    // move the ground points
    points.forEach(({point, id}) => {
      var groundPoint = this.spec.groundPoints[id];

      if (!groundPoint) {
        throw new Error(`ground point ${id} doesn't exist`);
      }

      var {x: prevX, y: prevY} = groundPoint;
      groundPoint.x = point.x;
      groundPoint.y = point.y;
      prevPoints[id] = {x: prevX, y: prevY};
    });

    if (!this.calculatePositions()) {
      // revert if it failed
      points.forEach(({point, id}) => {
        var groundPoint = this.spec.groundPoints[id];
        groundPoint.x = prevPoints[id].x;
        groundPoint.y = prevPoints[id].y;
      });
      this.calculatePositions();
    }
  }

  tryRotatingLinkageInput(): boolean {
    var flag = true;

    Object.keys(this.spec.extenders).forEach((id) => {
      var rotaryInput = this.spec.extenders[id];
      rotaryInput.angle += rotaryInput.speed * this.speed;
      if (!this.calculatePositions()) {
        this.reverseRotary(id.base);
        rotaryInput.angle += rotaryInput.speed * this.speed;
        this.calculatePositions();
        flag = false;
      }
    });

    return flag;
  }

  tryChangingBarLength(lenChange: number, p0id?: string, p1id?: string) {
    if (!p0id || !p1id) {
      throw new Error('p0id and p1id must be defined');
    }

    var oldLen = this.spec.points[p0id][p1id].len;
    var newLen = oldLen + lenChange;

    this._changeBarLength(newLen, p0id, p1id);
    if (!this.calculatePositions()) {
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
      speed: 1,
      len: 5,
    };
    this.spec.groundPoints[point0Id] = {x: point1.x + 1, y: point1.y};
    this.spec.groundPoints[point1Id] = {x: point1.x, y: point1.y};
    this.spec.rotaries[point1Id] = point2Id;

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

  calculatePositions(): boolean {
    try {
      var positions = this._calculatePositionsAux(this.spec);
    } catch (e) {
      return false;
    }

    this.positions = positions;
    return true;
  }

  _calculatePositionsAux(spec: LinkageSpecType): {[key:string]: Point} {
    var {points, extenders, groundPoints} = spec;
    var positions = {};

    var idList = Object.keys(points);
    var oldLength;

    do {
      oldLength = idList.length;
      idList = idList.filter(id => {
        if (groundPoints[id]) {
          positions[id] = groundPoints[id];
        } else if (
          extenders[id] &&
          positions[extenders[id].base] &&
          positions[extenders[id].ref]
        ) {
          positions[id] = Geom.calcPointFromExtender(
            positions[extenders[id].base],
            positions[extenders[id].ref],
            extenders[id].len,
            extenders[id].angle
          );
        } else {
          var knownAdjacents = Object.keys(points[id]).filter(
            adj => positions[adj]
          );

          if (knownAdjacents.length >= 2) {
            positions[id] = Geom.calcPointFromTriangle(
              positions[knownAdjacents[0]],
              positions[knownAdjacents[1]],
              points[id][knownAdjacents[0]].len,
              points[id][knownAdjacents[1]].len
            ).sol1;
          }
        }

        return !positions[id];
      });
    } while (idList.length > 0 && idList.length < oldLength);

    if (idList.length > 0) {
      throw new Error('failed to compute all points');
    }

    return positions;
  }
}

module.exports = Linkage;
