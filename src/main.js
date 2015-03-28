/* @flow */

'use strict';

var Linkage = require('./Linkage.js');
var LinkageRenderer = require('./LinkageRenderer');
var UI = require('./UI.js');
var UIState = require('./UIState');

var linkageData = require('./linkageData.js');

var linkage = new Linkage(linkageData);
var initialState = UIState.getInitialUnpausedState(linkage, true);
var renderer = new LinkageRenderer('mycanvas');

var ui = new UI(initialState, renderer, []);
ui.animate();
