module.exports = {
  points: {
    p0: { 
      p1: { len: 1 },
    },
    p1: {
      p0: { len: 1 },
      p2: { len: 5 },
    },
    p2: {
      p1: { len: 5 },
    },
    p3: {
      p4: { len: 1 },
    },
    p4: {
      p3: { len: 1 },
      p5: { len: 5 },
    },
    p5: {
      p4: { len: 5 },
    },
    p6: {
      p7: { len: 1 },
    },
    p7: {
      p6: { len: 1 },
      p8: { len: 5 },
    },
    p8: {
      p7: { len: 5 },
    },
  },
  extenders: {
    p2: {
      base: 'p1',
      ref: 'p0',
      angle: 0.0,
      len: 5,
    },
    p5: {
      base: 'p4',
      ref: 'p3',
      angle: 0.0,
      len: 5,
    },
    p8: {
      base: 'p7',
      ref: 'p6',
      angle: 0.0,
      len: 5,
    },
  },
  groundPoints: {
    p0: { x: -4, y: 0 },
    p1: { x: -5, y: 0 }, 
    p3: { x: 6, y: 0 }, 
    p4: { x: 5, y: 0 }, 
    p6: { x: 1, y: 5 }, 
    p7: { x: 0, y: 5 }, 
  },
};
