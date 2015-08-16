/* @flow */

var OptObj = require('./OptObj');
var Linkage = require('../Linkage');
var LinkageOptObj = require('./LinkageOptObj');

var calcSumOfMins = require('../math/GeometryUtils').calcSumOfMins;

type Point = {
  x: number;
  y: number;
};

class CurveOptObj extends LinkageOptObj {
  __calcPathPerf(path1: Array<Point>, path2: Array<Point>): number {
    return calcSumOfMins(path1, path2) + calcSumOfMins(path2, path1);
  }
}

module.exports = CurveOptObj;
