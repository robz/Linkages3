/* @flow */

var OptObj = require('./OptObj');

function optimizeStep(thing: OptObj): OptObj {
  var newThing = thing.copy();

  // loop through all features and tweak them
  newThing.getFeatures().forEach(tweak => tweak());

  // if the new thing is not invalid,
  if (!newThing.isValid()) {
    // return the old thing
    return thing;
  }

  // return the old thing if its perf is better
  //  (the lower the perf value the better)
  if (thing.calcPerfCached() <= newThing.calcPerfCached()) {
    return thing;
  }

  // return the new thing and its performance
  return newThing;
}

module.exports = optimizeStep;
