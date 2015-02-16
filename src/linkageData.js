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
  },
  extenders: {
    p2: {
      base: 'p1',
      ref: 'p0',
      angle: 0.9272952180016122, // atan(4/3)
      len: 5,
    },
  },
  groundPoints: {
    p0: { x: 1, y: 0 },
    p1: { x: 0, y: 0 }, 
  },
};
