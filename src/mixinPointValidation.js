/* @flow */

var euclid = require('./GeometryUtils').euclid;

var MIN_SEGMENT_LENGTH = 0.5;

function mixinPointValidation(points, functNames, context) {
  var isPointValid = function(point) {
    return points.reduce((accum, p2) => {
      return accum && euclid(point, p2) >= MIN_SEGMENT_LENGTH;
    }, true);
  };

  var validateMethods = {
    onMouseDrag(point: Point): boolean {
      return isPointValid(point);
    },

    onMouseUp(mousePoint: Point): boolean {
      return isPointValid(point);
    },

    onGroundDown(p0id: string): boolean {
      return isPointValid(this.linkage.getPoint(p0id));
    },

    onRotaryDown(p0id: string): boolean {
      return isPointValid(this.linkage.getPoint(p0id));
    },

    onAnyPointUp(p0id: string): boolean {
      return isPointValid(this.linkage.getPoint(p0id));
    },

    onPointUp(p0id: string): boolean {
      return isPointValid(this.linkage.getPoint(p0id));
    },

    onCanvasUp(pointA: Point): boolean {
      return isPointValid(pointA);
    },
  };

  functNames.forEach(functName => {
    var validate = validateMethods[functName];
    var original = context[functName];

    context[functName] = function(...args) {
      return validate.apply(context, args) ?
        original.apply(context, args) :
        this;
    };
  });
}

module.exports = mixinPointValidation;
