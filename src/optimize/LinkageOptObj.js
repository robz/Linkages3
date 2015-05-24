/* @flow */

var OptObj = require('./OptObj');
var Linkage = require('../Linkage');

var calcSumOfMins = require('../math/GeometryUtils').calcSumOfMins;

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
    this.linkage.calculatePositions();
  }

  __calcPerf(): number {
    var path1 = this.linkage.getPath(this.__data.id);
    path1 === null && new Error('incomplete loop');

    var path2 = this.__data.path;

    path1.length === 0 && new Error('linkage path has to have points');
    path2.length === 0 && new Error( 'provided path has to have points');

    return calcSumOfMins(path1, path2) + calcSumOfMins(path2, path1);
  }

  getFeatures(): Array<Function> {
    var that = this;
    var spec = this.__data.linkageSpec;

    var {points, rotaries, extenders, groundPoints} = spec;
    var [groundIDs, extenderIDs, pointIDs] =
      [groundPoints, extenders, points].map(Object.keys);

    var refPoints = {};
    extenderIDs.forEach(id => {refPoints[extenders[id].ref] = true});

    var groundFeatures = groundIDs
      .filter(id => !refPoints[id])
      .map(id => {
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

    var notGroundFeatures = pointIDs
      .filter(id => !groundPoints[id] && !refPoints[id])
      .map(id => {
        var orig = this.linkage.positions[id];

        return () => {
          var deltaX = (Math.random() - .5) * 2 * .5;
          var deltaY = (Math.random() - .5) * 2 * .5;

          var point = {
            x: orig.x + deltaX,
            y: orig.y + deltaY,
          };

          this.linkage.moveNotGroundPoint(point, id)
        };
      });

    return [
      ...groundFeatures,
      ...notGroundFeatures,
    ];
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
