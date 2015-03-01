/* @flow */

'use strict';

var linkageData = require('./linkageData.js');
var Linkage = require('./Linkage.js');
var UI = require('./x/UI.js');

var linkage = new Linkage(linkageData);
var ui = new UI('mycanvas', linkage);
ui.animate();
