jest.autoMockOff();

describe('CurveOptObj', function() {
  it('will incrementally optimize', function() {
    var CurveOptObj = require('../optimize/CurveOptObj');
    var optimizeStep = require('../optimize/optimizeStep');

    var path = [{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}];
    var optObj = new CurveOptObj({
      path,
      linkageSpec: require('../linkageData'),
      id: 'p2',
    });
  });
});
