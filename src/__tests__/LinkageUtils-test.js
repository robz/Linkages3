jest
  .dontMock('../GeometryUtils')
  .dontMock('../Linkage');

var linkageData = {
  points: {
    p0: {
      p1: { len: 1 },
    },
    p1: {
      p0: { len: 1 },
      p2: { len: 5 },
    },
    p2: {
      p1: { len: 1 },
      p3: { len: 10 },
    },
    p3: {
      p2: { len: 10 },
      p4: { len: 15 },
    },
    p4: {
      p3: { len: 15 },
    },
  },
  extenders: {
    p2: {
      base: "p1",
      ref: "p0",
      angle: 0.9272952180016122, // atan(4/3)
      len: 5,
    },
  },
  groundPoints: {
    p0: { x: 1, y: 0 },
    p1: { x: 0, y: 0 },
    p4: { x: 22, y: -8 },
  },
};

describe('calcLinkagePositions', function () {
  it('calculates linakges positions', function () {
    var Linkage = require('../Linkage');
    var linkage = new Linkage(linkageData);
    linkage.calculatePositions();
    var res = linkage.positions;
    expect(res.p0).toBe(linkageData.groundPoints.p0);
    expect(res.p1).toBe(linkageData.groundPoints.p1);
    expect(res.p4).toBe(linkageData.groundPoints.p4);
    expect(res.p2.x).toBeCloseTo(3, 1e-10);
    expect(res.p2.y).toBeCloseTo(4, 1e-10);
    expect(res.p3.x).toBeCloseTo(13, 1e-10);
    expect(res.p3.y).toBeCloseTo(4, 1e-10);
  });
});

