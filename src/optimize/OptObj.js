/* @flow */

class OptObj {
  __data: Object;
  _perf: ?number;

  constructor(data: Object): void {
    this.__data = data;
    this._perf = null;
  }

  calcPerfCached(): number {
    if (typeof this._perf === 'number') {
      return this._perf;
    }

    var perf = this.__calcPerf();
    this._perf = perf;
    return perf;
  }

  __calcPerf(): number {
    throw new Error('__calcPerf not implemented');
  }

  copy(): OptObj {
    var dataCopy = JSON.parse(JSON.stringify(this.__data));
    var objCopy: any = new this.constructor(dataCopy);
    return objCopy;
  }

  getFeatures(): Array<Function> {
    throw new Error('getFeatures not implemented');
  }

  isValid(): boolean {
    throw new Error('isValid not implemented');
  }
}

module.exports = OptObj;
