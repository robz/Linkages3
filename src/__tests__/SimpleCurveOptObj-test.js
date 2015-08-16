jest.autoMockOff();

describe('SimpleCurveOptObj', function() {
  it('will incrementally optimize', function() {
    var SimpleCurveOptObj = require('../optimize/SimpleCurveOptObj');
    var optimizeStep = require('../optimize/optimizeStep');

    var pathDesired = [
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 1, y: 1},
    ];

    var pathInput = [
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 2, y: 1},
    ];

    var optObj = new SimpleCurveOptObj({pathDesired, pathInput});

    for (var i = 0; i < 100; i++) {
      var nextOptObj = optimizeStep(optObj);
      var oldPerf = optObj.calcPerfCached();
      var newPerf = nextOptObj.calcPerfCached();
      //console.log(JSON.stringify(nextOptObj.__data.pathInput, null, '  '));
      expect(oldPerf >= newPerf).toBe(true);
      optObj = nextOptObj;
    }
  });
});
