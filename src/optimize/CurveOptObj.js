/* @flow */

var OptObj = require('./OptObj');
var Linkage = require('../Linkage');
var LinkageOptObj = require('./LinkageOptObj');

var {
  calcAnglesOfPath,
  minTotalDiff,
  smoothList,
} = require('../math/CurveUtils');

type Point = {
  x: number;
  y: number;
};

class CurveOptObj extends LinkageOptObj {
  __calcPathPerf(path1: Array<Point>, path2: Array<Point>): number {
    var angles1 = smoothList(calcAnglesOfPath(path1), 2);
    var angles2 = smoothList(calcAnglesOfPath(path2), 2);
    var minForward = minTotalDiff(angles1, angles2);
    var minBackward = minTotalDiff(angles1.reverse(), angles2);
    return minForward < minBackward ? minForward : minBackward;
  }
}

module.exports = CurveOptObj;
