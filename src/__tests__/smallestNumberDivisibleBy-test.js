jest.dontMock('../math/smallestNumberDivisibleBy');
var smallestNumberDivisibleBy = require('../math/smallestNumberDivisibleBy');

describe('smallestNumberDivisibleBy', function() {
  it('finds the smallest number divisor', function () {
    [
      {
        list: [2,4],
        res: 4,
      },
      {
        list: [1,2,3],
        res: 6,
      },
      {
        list: [7,8],
        res: 7*8,
      },
      {
        list: [2,4,8],
        res: 8,
      },
      {
        list: [2,3,5,7,11,13,17],
        res: 2*3*5*7*11*13*17,
      },
      {
        list: [2,2,3,4,5,6,7,8],
        res: 2*3*2*5*7*2,
      },
    ].forEach(({list,res}) => {
      expect(smallestNumberDivisibleBy(list)).toBe(res);
    });
  });
});
