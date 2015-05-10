jest.autoMockOff();

describe('LinkageOptObj', function() {
  it('will incrementally optimize', function() {
    var LinkageOptObj = require('../optimize/LinkageOptObj');
    var optimizeStep = require('../optimize/optimizeStep');

    var optObj = new LinkageOptObj({
      path: [{x:10,y:0}],
      linkageSpec: require('../linkageData'),
      id: 'p2',
    });

    for (var i = 0; i < 100; i++) {
      var nextOptObj = optimizeStep(optObj);
      var oldPerf = optObj.calcPerfCached();
      var newPerf = nextOptObj.calcPerfCached();
      //console.log(newPerf, optObj.__data.linkageSpec.groundPoints.p1);
      expect(oldPerf >= newPerf).toBe(true);
      optObj = nextOptObj;
    }
  });
});
