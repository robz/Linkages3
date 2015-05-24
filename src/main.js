/* @flow */

'use strict';

var Linkage = require('./Linkage.js');
var LinkageRenderer = require('./graphics/LinkageRenderer');
var UI = require('./ui/UI.js');
var UIState = require('./ui/UIState');

var linkageData = require('./linkageData.js');

var linkage = new Linkage(linkageData);
var initialState = UIState.getInitialUnpausedState(linkage);
var renderer = new LinkageRenderer('mycanvas');

var ui = new UI(initialState, renderer, []);
ui.animate();
