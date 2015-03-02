/* @flow */

'use strict';

type OptionsType = {
  pointColor: ?string;
  lineColor: ?string;
  pointRadius: ?number;
  lineWidth: ?number;
};

type Point = {x: number; y: number};

var SCALE = 10;
var POINT_COLOR = 'black';
var LINE_COLOR = 'darkGray';
var BACKGROUND_COLOR = 'white';
var POINT_RADIUS = 4;
var LINE_WIDTH = 4;

function getOptions(opts?: ?OptionsType): OptionsType {
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

  constructor(canvasID: string, options: ?OptionsType) {
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

  drawPoint({x, y}: Point, options?: OptionsType) {
    var {pointColor, pointRadius} = getOptions(options);
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x, y, pointRadius, 0, 2 * Math.PI, true);
    this.ctx.fillStyle = pointColor;
    this.ctx.fill();
    this.ctx.restore();
  }

  drawLine(p1: Point, p2: Point, options?: OptionsType) {
    var {lineColor, lineWidth} = getOptions(options);
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.strokeStyle = lineColor;
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawBackground() {
    this.ctx.save();
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.fillRect(-this._width/2, -this._height/2, this._width, this._height);
    this.ctx.restore();
  }

  drawSegment(p1: Point, p2: Point, options?: OptionsType) {
    this.drawLine(p1, p2, options);
    this.drawPoint(p1, options);
    this.drawPoint(p2, options);
  }

  drawDirectedSegment(p1: Point, p2: Point, options?: OptionsType) {
    this.drawLine(p1, p2, options);
    this.drawPoint(p1, options);
  }

  drawLines(...args) {
    var options = args.pop(); 

    this.drawLine(args[0], args[1], options);

    if (args.length === 3) {
      this.drawLine(args[1], args[2], options);
    }

    this.drawPoint(args[0], options);
    this.drawPoint(args[1], options);

    if (args.length === 3) {
      this.drawPoint(args[2], options);
    }
  }
}

class LinkageRenderer extends CanvasRenderer {
  drawLinkage ({points, positions}: Object) {
    this.drawBackground();

    Object.keys(points).forEach((pointID) => {
      var p0 = positions[pointID];
      Object.keys(points[pointID]).forEach((pointID) => {
        var pi = positions[pointID];
        this.drawLine(p0, pi); 
      });
    }); 

    Object.keys(points).forEach((pointID) => {
      this.drawPoint(positions[pointID]);
    });
  }
}

module.exports = LinkageRenderer;
