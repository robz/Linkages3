jest.dontMock('../GeometryUtils');

describe('euclid', function() {
  it('finds the euclidean distance between two points', function() {
    var euclid = require('../GeometryUtils').euclid;
    expect(euclid({x:3, y:0}, {x:0, y:4})).toBe(5);
  });
});

describe('calcFromTriangle', function() {
  it('calculates a point on a triangle from the side lengths and other points',
    function() {
      var calcFromTriangle = require('../GeometryUtils').calcPointFromTriangle;

      var res1 = calcFromTriangle({x:3, y:0}, {x:0, y:4}, 3, 4);
      expect(res1.x).toBeCloseTo(0, 1e-10);
      expect(res1.y).toBeCloseTo(0, 1e-10);

      var res2 = calcFromTriangle({x:0, y:4}, {x:3, y:0}, 3, 4);
      expect(res2.x).toBeCloseTo(3, 1e-10);
      expect(res2.y).toBeCloseTo(4, 1e-10);
    }
  );
});
