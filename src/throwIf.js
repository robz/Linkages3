/* @flow */
'use strict';

function throwIf(condition, explanation) {
  if (!condition) {
    throw new Error(explanation);
  }
}

module.exports = throwIf;
