/* @flow */

'use strict';

var utils = require('./LinkageCalculationUtils');

/*

example spec:

   *----*
  /      \
 *-*      \
 + +       *
           +

calcPositions({
  points: {
    p0: { 
      p1: { len: 1 },
    },
    p1: {
      p0: { len: 1 },
      p2: { len: 1 },
    },
    p2: {
      p1: { len: 1 },
      p3: { len: 4 },
    },
    p3: {
      p2: { len: 4 },
      p4: { len: 2 }, 
    },
    p4: {
      p3: { len: 2 },
    },
  },
  extenders: {
    p2: {
      base: "p1",
      ref: "p0",
      angle: Math.PI/3,
      len: 1,
    },
  },
  groundPoints: {
    p0: { x: 1, y: 0 },
    p1: { x: 0, y: 0 }, 
    p4: { x: 6, y: -1 },
  },
}));

*/

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
        positions[id] = utils.calcFromExtender(
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
          positions[id] = utils.calcFromTriangle(
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

module.exports = calcLinkagePositions;
