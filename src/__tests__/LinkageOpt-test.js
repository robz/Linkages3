jest.autoMockOff();

describe('LinkageOptObj', function() {
  it('will incrementally optimize', function() {
    var LinkageOptObj = require('../optimize/LinkageOptObj');
    var optimizeStep = require('../optimize/optimizeStep');

    var goal = {x:10,y:0};
    var optObj = new LinkageOptObj({
      path: [goal],
      linkageSpec: require('../linkageData'),
      id: 'p2',
    });

    for (var i = 0; i < 200; i++) {
      var nextOptObj = optimizeStep(optObj);
      var oldPerf = optObj.calcPerfCached();
      var newPerf = nextOptObj.calcPerfCached();
      //console.log(newPerf, optObj.__data.linkageSpec.groundPoints.p1);
      expect(oldPerf >= newPerf).toBe(true);
      optObj = nextOptObj;
    }

    var euclid = require('../math/GeometryUtils').euclid;
    var res = optObj.__data.linkageSpec.groundPoints.p1;
    var delta = euclid(res, goal);
    //console.log('delta: ' + delta);
    expect(delta).toBeLessThan(.5);
  });
});
