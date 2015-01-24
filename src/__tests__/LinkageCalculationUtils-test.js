jest.dontMock('../LinkageCalculationUtils');

describe('euclid', function() {
  it('finds the euclidean distance between two points', function() {
    var euclid = require('../LinkageCalculationUtils').euclid;
    expect(euclid({x:3, y:0}, {x:0, y:4})).toBe(5);
  });
});

describe('calcFromTriangle', function() {
  it('calculates a point on a triangle from the side lengths and other points',
    function () {
      var calcFromTriangle = require('../LinkageCalculationUtils').calcFromTriangle;
      expect(calcFromTriangle({x:3, y:0}, {x:0, y:4}, 3, 4)).toBe({x:0, y:0});
    }
  );
});
