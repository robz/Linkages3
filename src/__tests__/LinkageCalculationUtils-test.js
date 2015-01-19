jest.dontMock('../LinkageCalculationUtils');

describe('euclid', function() {
  it('finds the euclidean distance between two points', function() {
    var euclid = require('../LinkageCalculationUtils').euclid;
    expect(euclid({x:3, y:0}, {x:0, y:4})).toBe(5);
  });
});
