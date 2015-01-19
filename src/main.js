/* @flow */

var calcLinkagePositions = require('./calcLinkagePositions');

calcLinkagePositions({
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
});
