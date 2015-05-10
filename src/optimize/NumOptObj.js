/* @flow */

var OptObj = require('./OptObj');

type DataType = {
  nums: Array<number>;
  num: number;
};

class NumOptObj extends OptObj {
  constructor(data: DataType): void {
    super(data);
  }

  __calcPerf(): number {
    // multiple all nums together
    var res = this.__data.nums.reduce((a, e) => a * e, 1);
    return Math.abs(this.__data.num - res);
  }

  getFeatures(): Array<{tweak:Function}> {
    var that = this;
    return this.__data.nums.map((e, i) => {
      return {
        tweak() {
          that.__data.nums[i] += Math.round(10 * (Math.random() - .5));
        }
      };
    });
  }

  isValid(): boolean {
    return true;
  }
}

module.exports = NumOptObj;
