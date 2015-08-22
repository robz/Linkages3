/* @flow */

var OptObj = require('./OptObj');
var {
  calcAnglesOfPath,
  interpolatePath,
  minTotalDiff,
  smoothList,
} = require('../math/CurveUtils');

type Point = {
  x: number;
  y: number;
};

type DataType = {
  pathDesired: Array<Point>;
  pathInput: Array<Point>;
};

var RANGE = .1;

class SimpleCurveOptObj extends OptObj {
  constructor(data: DataType): void {
    super(data);
  }

  __calcPerf(): number {
    return this.__calcPathPerf(this.__data.pathDesired, this.__data.pathInput);
  }

  __calcPathPerf(path1: Array<Point>, path2: Array<Point>): number {
    var getAngles = path => calcAnglesOfPath(interpolatePath(path, 100));
    var angles1 = getAngles(path1);
    var angles2 = getAngles(path2);
    var minForward = minTotalDiff(angles1, angles2);
    var minBackward = minTotalDiff(angles1.reverse(), angles2);
    var res = minForward < minBackward ? minForward : minBackward;
    return res;
  }

  getFeatures(): Array<Function> {
    var path = this.__data.pathInput;
    return path.map((point, i) => {
      return () => {
        path[i] = {
          x: point.x + (RANGE * 2 * (Math.random() - .5)),
          y: point.y + (RANGE * 2 * (Math.random() - .5)),
        };
      }
    });
  }

  isValid(): boolean {
    return true;
  }
}

module.exports = SimpleCurveOptObj;
