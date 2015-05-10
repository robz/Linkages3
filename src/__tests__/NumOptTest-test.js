jest.autoMockOff();

describe('NumOptObj', function() {
  it('will incrementally optimize', function() {
    var NumOptObj = require('../optimize/NumOptObj');
    var optimizeStep = require('../optimize/optimizeStep');

    var optObj = new NumOptObj({num: 1000, nums: [1,2,3,4,5,6]});

    for (var i = 0; i < 100; i++) {
      var nextOptObj = optimizeStep(optObj);
      var oldPerf = optObj.calcPerfCached();
      var newPerf = nextOptObj.calcPerfCached();
      expect(oldPerf >= newPerf).toBe(true);
      optObj = nextOptObj;
    }
  });
});
