/* @flow */

var OptObj = require('./OptObj');
var Linkage = require('../Linkage');

var calcSumOfMins = require('../GeometryUtils').calcSumOfMins;
var throwIf = require('../throwIf');

type Point = {
  x: number;
  y: number;
};

type DataType = {
  linkageSpec: Object;
  path: Array<Point>;
  id: string;
};

class LinkageOptObj extends OptObj {
  _linkage: Linkage;

  constructor(data: DataType): void {
    super(data);
    this._linkage = new Linkage(data.linkageSpec);
  }

  __calcPerf(): number {
    var path1 = this._linkage.getPath(this.__data.id);
    var path2 = this.__data.path;

    throwIf(path1.length >= 0, 'linkage path has to have points');
    throwIf(path2.length >= 0, 'provided path has to have points');

    return calcSumOfMins(path1, path2) + calcSumOfMins(path2, path1);
  }

  getFeatures(): Array<Function> {
    var that = this;
    var spec = this.__data.linkageSpec;

    return Object.keys(spec.groundPoints).map(id => {
      var orig = spec.groundPoints[id];

      return () => {
        var point = {
          x: orig.x + (Math.random() - .5) * 2,
          y: orig.y + (Math.random() - .5) * 2,
        };

        this._linkage.tryMovingGroundPoints([{id, point}]);
      };
    });
  }

  isValid(): boolean {
    return true;
  }
}

module.exports = LinkageOptObj;
