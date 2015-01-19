jest.dontMock('../sum');

describe('sum', function() {
  it('added two numbers together', function () {
    var sum = require('../sum');
    expect(sum(1,2)).toBe(3);
  });
});
