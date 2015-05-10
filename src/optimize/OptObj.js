/* @flow */

var throwIf = require('../throwIf');

class OptObj {
  __data: Object;
  _perf: number;

  constructor(data: Object): void {
    this.__data = data;
    this._perf = null;
  }

  calcPerfCached(): number {
    if (this._perf !== null) {
      return this._perf;
    }

    this._perf = this.__calcPerf();
    return this._perf;
  }

  __calcPerf(): number {
    throwIf(false, '_calcPerf not implemented');
  }

  copy(): OptObj {
    var dataCopy = JSON.parse(JSON.stringify(this.__data));
    return new this.constructor(dataCopy);
  }

  getFeatures(): Array<{tweak:Function}> {
    throwIf(false, 'getFeatures not implemented');
  }

  isValid(): boolean {
    throwIf(false, 'isValid not implemented');
  }
}

module.exports = OptObj;
