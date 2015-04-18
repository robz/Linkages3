/* @flow */

var euclid = require('./GeometryUtils').euclid;

var MIN_SEGMENT_LENGTH = 0.5;

function mixinPointValidation(points, functNames, that) {
  var isPointValid = function(point) {
    return points.reduce((accum, p2) => {
      return accum && euclid(point, p2) >= MIN_SEGMENT_LENGTH;
    }, true);
  };

  var validateFuncts = {
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

  // replace each provided method (call it F) with new method (call it G) that
  // wraps F. G executes the validation function first, and if the validation
  // function returns true, G returns the result of calling F. otherwise, it
  // returns the context of the method.
  functNames.forEach(functName => {
    var validateFunct = validateFuncts[functName];
    var originalFunct = that[functName];

    that[functName] = function(...args) {
      // use `this` instead of `that` for the context so that the new method
      // can be used in whatever context it's need (especially useful for
      // inheritance)
      return validateFunct.apply(this, args) ?
        originalFunct.apply(this, args) :
        this;
    };
  });
}

module.exports = mixinPointValidation;
