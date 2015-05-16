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
      angle: 0.0,
      len: 5,
      speed: 1,
    },
  },
  rotaries: {
    p1: 'p2',
  },
  groundPoints: {
    p0: { x: 1, y: 0 },
    p1: { x: 0, y: 0 },
  },
};
