jest.autoMockOff();

describe('curve math', function() {
  it('will interpolate between two points', function() {
    var {
      interpolateBetweenPoints,
    } = require('../math/CurveUtils');

    var p1 = {x:0, y:0};
    var p2 = {x:100, y:0};
    var interpolatedPoint = interpolateBetweenPoints(p1, p2, 50);
    expect(interpolatedPoint).toEqual({
      x: 50,
      y: 0,
    });
  });

  it('will interpolate to the last point', function() {
    var {
      interpolateBetweenPoints,
    } = require('../math/CurveUtils');

    var p1 = {x:0, y:0};
    var p2 = {x:100, y:0};
    var interpolatedPoint = interpolateBetweenPoints(p1, p2, 100);
    //console.log(interpolatedPoint);
  });

  it('will interpolate a new path', function() {
    var {
      interpolatePath,
    } = require('../math/CurveUtils');

    var path = [
      {x:0, y:0},
      {x:5, y:0},
      {x:5, y:5},
      {x:0, y:5},
    ];
    var newPath = interpolatePath(path, 5);
    var expected = [
      {x:0, y:0},
      {x:4, y:0},
      {x:5, y:3},
      {x:3, y:5},
      {x:0, y:4},
    ];
    newPath.forEach((e, i) => {
      expect(e.x).toBeCloseTo(expected[i].x);
      expect(e.y).toBeCloseTo(expected[i].y);
    });
  });
});
