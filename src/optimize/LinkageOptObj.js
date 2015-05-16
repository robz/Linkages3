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
  linkage: Linkage;

  constructor(data: DataType): void {
    super(data);
    this.linkage = new Linkage(data.linkageSpec);
  }

  __calcPerf(): number {
    var path1 = this.linkage.getPath(this.__data.id);
    throwIf(path1 !== null, 'incomplete loop');
    var path2 = this.__data.path;

    throwIf(path1.length >= 0, 'linkage path has to have points');
    throwIf(path2.length >= 0, 'provided path has to have points');

    return calcSumOfMins(path1, path2) + calcSumOfMins(path2, path1);
  }

  getFeatures(): Array<Function> {
    var that = this;
    var spec = this.__data.linkageSpec;

    var {rotaries, extenders, groundPoints} = spec;
    var groundIDs = Object.keys(groundPoints);
    var extenderIDs = Object.keys(extenders);

    return groundIDs.filter(id => {
      // ensure that this ground point is not a reference
      return extenderIDs.every(id2 => id !== extenders[id2].ref);
    }).map(id => {
      var orig = spec.groundPoints[id];

      return () => {
        var deltaX = (Math.random() - .5) * 2 * .5;
        var deltaY = (Math.random() - .5) * 2 * .5;

        var point = {
          x: orig.x + deltaX,
          y: orig.y + deltaY,
        };

        var moves = [{id, point}];

        if (rotaries[id]) {
          var refID = extenders[rotaries[id]].ref;
          var refCurPoint = groundPoints[refID];
          var refNextPoint = {
            x: refCurPoint.x + deltaX,
            y: refCurPoint.y + deltaY,
          };
          moves.push({point: refNextPoint, id: refID});
        }

        this.linkage.tryMovingGroundPoints(moves);
      };
    });
  }

  isValid(): boolean {
    try {
      this.calcPerfCached();
      return true;
    } catch (e) {
      return false;
    }
  }
}

module.exports = LinkageOptObj;
