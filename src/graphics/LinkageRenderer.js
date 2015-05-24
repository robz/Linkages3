/* @flow */
'use strict';

type OptionsType = {
  pointColor?: string;
  lineColor?: string;
  pointRadius?: number;
  lineWidth?: number;
  drawPoints?: boolean;
};

type Point = {x: number; y: number};

var SCALE = 10;
var POINT_COLOR = 'black';
var LINE_COLOR = 'darkGray';
var BACKGROUND_COLOR = 'white';
var POINT_RADIUS = 4;
var LINE_WIDTH = 4;

function getOptions(opts: ?OptionsType): OptionsType {
  opts = {
    pointColor: (opts && opts.pointColor) ? opts.pointColor : POINT_COLOR,
    lineColor: (opts && opts.lineColor) ? opts.lineColor : LINE_COLOR,
    pointRadius: (opts && opts.pointRadius) ? opts.pointRadius : POINT_RADIUS,
    lineWidth: (opts && opts.lineWidth) ? opts.lineWidth : LINE_WIDTH,
  };

  opts.pointRadius = opts.pointRadius / SCALE;
  opts.lineWidth = opts.lineWidth / SCALE;

  return opts;
}

class CanvasRenderer {
  ctx: any;
  _width: number;
  _height: number;

  constructor(canvasID: string) {
    var canvas: any = document.getElementById(canvasID);
    this.ctx = canvas.getContext('2d');

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    this._width = canvas.width;
    this._height = canvas.height;

    this.ctx.scale(1, -1);
    this.ctx.translate(this._width/2, -this._height/2);
    this.ctx.scale(SCALE, SCALE);
  }

  inverseTransform({x, y}: Point): Point {
    x *= 1;
    y *= -1;
    x -= this._width/2;
    y -= -this._height/2;
    x /= SCALE;
    y /= SCALE;
    return {x, y};
  }

  __drawPointAux({x, y}: Point, pointRadius) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, pointRadius, 0, 2 * Math.PI, true);
    this.ctx.fill();
  }

  drawPoint(point: Point, options?: ?OptionsType) {
    var {pointColor, pointRadius} = getOptions(options);
    this.ctx.save();
    this.ctx.fillStyle = pointColor;
    this.__drawPointAux(point, pointRadius);
    this.ctx.restore();
  }

  __drawLineAux(p1: Point, p2: Point) {
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.stroke();
  }

  drawLine(p1: Point, p2: Point, options?: ?OptionsType) {
    var {lineColor, lineWidth} = getOptions(options);
    this.ctx.save();
    this.ctx.strokeStyle = lineColor;
    this.ctx.lineWidth = lineWidth;
    this.__drawLineAux(p1, p2);
    this.ctx.restore();
  }

  __drawBackground() {
    this.ctx.save();
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.fillRect(-this._width/2, -this._height/2, this._width, this._height);
    this.ctx.restore();
  }

  // TODO how to get rid of any type here?
  drawLines(points: Array<any>, options?: OptionsType) {
    if (points.length === 0) {
      return;
    }

    var {lineColor, lineWidth, pointColor, pointRadius} = getOptions(options);
    this.ctx.save();
    this.ctx.strokeStyle = lineColor;
    this.ctx.lineWidth = lineWidth;
    this.ctx.fillStyle = pointColor;

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    points.forEach((point, i) => {
      if (i !== 0) {
        this.ctx.lineTo(point.x, point.y);
      }
    });
    this.ctx.stroke();

    if (options && options.drawPoints) {
      points.forEach(({x, y}) => {
        this.ctx.beginPath();
        this.ctx.arc(x, y, pointRadius, 0, 2 * Math.PI, true);
        this.ctx.fill();
      });
    }

    this.ctx.restore();
  }
}

class LinkageRenderer extends CanvasRenderer {
  drawLinkage ({points, positions}: Object) {
    this.__drawBackground();

    Object.keys(points).forEach(pointID => {
      var p0 = positions[pointID];
      Object.keys(points[pointID]).forEach(pointIDi => {
        var pi = positions[pointIDi];
        this.drawLine(p0, pi);
      });
    });

    Object.keys(points).forEach((pointID) => {
      this.drawPoint(positions[pointID]);
    });
  }
}

module.exports = LinkageRenderer;
