/* @flow */

'use strict';

var utils = require('./geometry');

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
        positions[id] = utils.calcPointFromExtender(
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
          positions[id] = utils.calcPointFromTriangle(
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
