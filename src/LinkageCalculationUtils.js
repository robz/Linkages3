/* @flow */

'use strict';

function makeSegmentsFromLinkage({points}, positions) {
  var segments = [];

  Object.keys(points).forEach((pointID) => {
    Object.keys(points[pointID]).forEach((point2ID) => {
      segments.push([positions[pointID], positions[point2ID]]);
    })
  });

  return segments;
}

module.exports = {makeSegmentsFromLinkage};
