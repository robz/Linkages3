/* @flow */

'use strict';

var GeometryUtils = require('./GeometryUtils.js');

type Point = {x: number; y: number};

type LinkageDataType = {
  groundPoints: Object;
  points: Object;
  extenders: Object;
};

function addGroundSegment(
  linkageData: LinkageDataType, 
  positions: Object,
  groundPoint: Point,
  auxPoint: Point,
  {id: connectedID}: {id: string}
) {
  var numPoints = Object.keys(linkageData.points).length;
  var groundID = 'p' + numPoints;
  var auxID = 'p' + (numPoints + 1);
  
  linkageData.groundPoints[groundID] = {
    x: groundPoint.x,
    y: groundPoint.y,
  };

  var distGroundToAux = GeometryUtils.euclid(groundPoint, auxPoint); 
  var distAuxToConnected = GeometryUtils.euclid(auxPoint, positions[connectedID]);

  linkageData.points[groundID] = {};
  linkageData.points[groundID][auxID] = {len: distGroundToAux};

  linkageData.points[auxID] = {};
  linkageData.points[auxID][groundID] = {len: distGroundToAux};
  linkageData.points[auxID][connectedID] = {len: distAuxToConnected};

  linkageData.points[connectedID][auxID] = {len: distAuxToConnected};
}

function getClosestThings(
  linkageData: LinkageDataType, 
  positions: Object, 
  currentPoint: Point
): Object {
  var points = Object.keys(positions).map(id => {
    var res = positions[id];
    res.id = id;
    return res;
  });

  var closestPointInfo = GeometryUtils.findClosestThingToPoint(
    points,
    currentPoint,
    GeometryUtils.euclid
  );

  var closestSegmentInfo = GeometryUtils.findClosestThingToPoint(
    makeSegmentsFromLinkage(linkageData.points, positions),
    currentPoint,
    GeometryUtils.calcMinDistFromSegmentToPoint
  );

  return {closestPointInfo, closestSegmentInfo};
}

function makeSegmentsFromLinkage(
  points: Object, 
  positions: Object
): Array<Array<Point>> {
  var segments = [];

  Object.keys(points).forEach((pointID) => {
    var p0 = positions[pointID];
    p0.id = pointID;
    Object.keys(points[pointID]).forEach((point2ID) => {
      var p1 = positions[point2ID];
      p1.id = point2ID;
      segments.push([p0, p1]);
    })
  });

  return segments;
}

function calcLinkagePositions(
  {points, extenders, groundPoints}: Object
): Object {
  var positions = {};

  var idList = Object.keys(points);
  var oldLength;

  do {
    oldLength = idList.length;
    idList = idList.filter((id) => {
      if (groundPoints[id]) {
        positions[id] = groundPoints[id];
      } else if (
        extenders[id] && 
        positions[extenders[id].base] && 
        positions[extenders[id].ref]
      ) {
        positions[id] = GeometryUtils.calcPointFromExtender(
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
          positions[id] = GeometryUtils.calcPointFromTriangle(
            positions[knownAdjacents[0]],
            positions[knownAdjacents[1]],
            points[id][knownAdjacents[0]].len,
            points[id][knownAdjacents[1]].len
          );
        }
      }

      return !positions[id];
    });
  } while (idList.length > 0 && idList.length < oldLength);

  return positions;
}

module.exports = {
  makeSegmentsFromLinkage, 
  calcLinkagePositions, 
  getClosestThings,
  addGroundSegment,
};
