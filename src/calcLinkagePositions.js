/* @flow */
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

function calcLinkagePositions({points, extenders, groundPoints}: Object): Object {
  var positions = {};
  var numPoints = Object.keys(points).length;
  var ii = 0;
  var numCalculated = 0;

  var id, knownAdjacents;

  while (numCalculated < numPoints) {
    id = Object.keys(points)[(ii++) % numPoints];
    console.log(id, positions);

    if (positions[id]) {
      continue;
    }

    if (groundPoints[id]) {
      positions[id] = groundPoints[id];
      numCalculated++;
      continue;
    }

    if (
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
      numCalculated++;
      continue;
    }

    knownAdjacents = Object.keys(points[id]).filter(adj => positions[adj]);
    if (knownAdjacents.length >= 2) { 
      positions[id] = utils.calcFromTriangle(
        positions[knownAdjacents[0]],
        positions[knownAdjacents[1]],
        points[id][knownAdjacents[0]].len,
        points[id][knownAdjacents[1]].len
      );
      numCalculated++;
    }
  };

  return positions;
}

module.exports = calcLinkagePositions;
