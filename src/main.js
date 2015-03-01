/* @flow */

'use strict';

var LinkageUI = require('./LinkageUI');
var linkageData = require('./linkageData.js');
var newui = require('./x/UI.js');

var ui = new LinkageUI('mycanvas', linkageData);
ui.animate();
