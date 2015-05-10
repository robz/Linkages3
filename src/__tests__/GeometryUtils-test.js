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
      expect(res1.sol1.x).toBeCloseTo(0, 1e-10);
      expect(res1.sol1.y).toBeCloseTo(0, 1e-10);

      var res2 = calcFromTriangle({x:0, y:4}, {x:3, y:0}, 3, 4);
      expect(res2.sol1.x).toBeCloseTo(3, 1e-10);
      expect(res2.sol1.y).toBeCloseTo(4, 1e-10);
    }
  );
});

describe('calcSumOfMins', function() {
  it('sums distance with paths of only one point each',
    function () {
      var calcSumOfMins = require('../GeometryUtils').calcSumOfMins;
      var path1 = [
        {x:0,y:0},
      ];
      var path2 = [
        {x:3,y:4},
      ];
      var res = calcSumOfMins(path1, path2);
      expect(res).toBeCloseTo(5, 1e-10);
    }
  );

  it('finds the min dist from a point in the first path to the second',
    function () {
      var calcSumOfMins = require('../GeometryUtils').calcSumOfMins;
      var path1 = [
        {x:0,y:0},
      ];
      var path2 = [
        {x:0,y:1},
        {x:0,y:2},
        {x:0,y:3},
        {x:0,y:-2},
        {x:1,y:1},
        {x:-1,y:2},
      ];
      var res = calcSumOfMins(path1, path2);
      expect(res).toBe(1);
    }
  );

  it('sums mins',
    function () {
      var calcSumOfMins = require('../GeometryUtils').calcSumOfMins;
      var path1 = [
        {x:0,y:0},
        {x:0,y:8},
        {x:6,y:0},
        {x:6,y:8},
      ];
      var path2 = [
        {x:3,y:4},
        {x:30,y:4},
        {x:10,y:40},
        {x:-10,y:15},
      ];
      var res = calcSumOfMins(path1, path2);
      expect(res).toBeCloseTo(5*4, 1e-10);
    }
  );
});
