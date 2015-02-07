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
      p3: { len: 10 },
      p7: { len: 10 },
    },
    p3: {
      p2: { len: 10 },
      p4: { len: 15 }, 
      p5: { len: 10 },
      p7: { len: Math.sqrt(8 * 8 + 10 * 10) },
    },
    p5: {
      p3: { len: 10 },    
      p6: { len: 10 },
    },
    p6: {
      p5: { len: 10 },
    },
    p4: {
      p3: { len: 15 },
    },
    p7: {
      p2: { len: 10 },
      p3: { len: Math.sqrt(8 * 8 + 10 * 10) },
      p9: { len: 20 }, 
    },
    p8: {
      p9: { len: 20 },
    },
    p9: {
      p8: { len: 20},
      p7: { len: 20},
    },
  },
  extenders: {
    p2: {
      base: 'p1',
      ref: 'p0',
      angle: 0.9272952180016122, // atan(4/3)
      len: 5,
    },
    p7: {
      base: 'p2',
      ref: 'p3',
      angle: Math.PI/2,
      len: 10,
    },
  },
  groundPoints: {
    p0: { x: 1, y: 0 },
    p1: { x: 0, y: 0 }, 
    p4: { x: 13, y: -11 },
    p6: { x: 18, y: 4 },
    p8: { x: -10, y: -5 },
  },
};
