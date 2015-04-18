/* this is too kool for flow */

function wrappedMethod(that, functName, newFunctFactory) {
  var originalMethod = that[functName];
  var newFunct = newFunctFactory(originalMethod);
  return function(...args) {
    newFunct.apply(this, args);
    originalMethod.apply(this, args);
  };
}

module.exports = wrapMethod;
