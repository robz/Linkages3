/* @flow */
'use strict';

class LoggedUIEvent {
  handlerName: string;
  eventData: any;

  constructor(handlerName: string, eventData: any) {
    this.handlerName = handlerName;
    this.eventData = eventData;
  }

  callHandler(ui: any): void {
    ui[this.handlerName](this.eventData);
  }
}

module.exports = LoggedUIEvent;
