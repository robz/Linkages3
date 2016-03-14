/* @flow */

'use strict';

var Linkage = require('./Linkage.js');
var LinkageRenderer = require('./graphics/LinkageRenderer');
var UI = require('./ui/UI.js');
var UIState = require('./ui/UIState');

var linkageData = require('./linkageData.js');

var urlData;
try {
  var s = window.location.search.substring(1);
  urlData = JSON.parse(window.unescape(s));
} catch (e) {}

if (urlData) {
  linkageData = urlData;
}

document.getElementById('button').onclick = function () {
  var location = window.location;
  var url = location.search
    ? location.href.split(location.search)[0]
    : location.href;
  location.href = url + '?' + window.escape(JSON.stringify(ui.state.linkage.spec));
}

var linkage = new Linkage(linkageData);
var initialState = UIState.getInitialUnpausedState(linkage);
var renderer = new LinkageRenderer('mycanvas');

var ui = new UI(initialState, renderer, []);
ui.animate();
