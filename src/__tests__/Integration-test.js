jest.autoMockOff();

var initialSpec = {"points":{"p0":{"p1":{"len":1}},"p1":{"p0":{"len":1},"p2":{"len":5}},"p2":{"p1":{"len":5}}},"extenders":{"p2":{"base":"p1","ref":"p0","angle":7.1600000000000055,"len":5,"speed":0.04}},"rotaries":{"p1":"p2"},"groundPoints":{"p0":{"x":1,"y":0,"id":"p0"},"p1":{"x":0,"y":0,"id":"p1"}}};
var mouseMoveEventLog = [{"handlerName":"onMouseMove","eventData":{"x":36,"y":22.9}}];

// make a four bar from the rotary
var State0_State14_State4_State6_State0 = {
  initialSpec: {"points":{"p0":{"p1":{"len":1}},"p1":{"p0":{"len":1},"p2":{"len":5}},"p2":{"p1":{"len":5}}},"extenders":{"p2":{"base":"p1","ref":"p0","angle":1.5000000000000007,"len":5,"speed":1}},"rotaries":{"p1":"p2"},"groundPoints":{"p0":{"x":1,"y":0,"id":"p0"},"p1":{"x":0,"y":0,"id":"p1"}}},
  finalSpec: {"points":{"p0":{"p1":{"len":1}},"p1":{"p0":{"len":1},"p2":{"len":5}},"p2":{"p1":{"len":5},"p4":{"len":17.71089208411792}},"p3":{"p4":{"len":15.273833834371775}},"p4":{"p2":{"len":17.71089208411792},"p3":{"len":15.273833834371775}}},"extenders":{"p2":{"base":"p1","ref":"p0","angle":1.5000000000000007,"len":5,"speed":1}},"rotaries":{"p1":"p2"},"groundPoints":{"p0":{"x":1,"y":0,"id":"p0"},"p1":{"x":0,"y":0,"id":"p1"},"p3":{"x":17.1,"y":-1.2,"id":"p3"}}},
  eventLog: [{"handlerName":"onMouseMove","eventData":{"x":-0.1,"y":5}},{"handlerName":"onMouseDown","eventData":{"x":-0.1,"y":5}},{"handlerName":"onMouseUp","eventData":{"x":-0.1,"y":5}},{"handlerName":"onMouseMove","eventData":{"x":15.6,"y":14}},{"handlerName":"onMouseDown","eventData":{"x":15.6,"y":14}},{"handlerName":"onMouseUp","eventData":{"x":15.6,"y":14}},{"handlerName":"onMouseMove","eventData":{"x":17.1,"y":-1.2}},{"handlerName":"onMouseDown","eventData":{"x":17.1,"y":-1.2}},{"handlerName":"onMouseUp","eventData":{"x":17.1,"y":-1.2}},{"handlerName":"onMouseMove","eventData":{"x":33.3,"y":1.3}}],
};

// add a segment and delete it
var deleteSpec = {"points":{"p0":{"p1":{"len":1}},"p1":{"p0":{"len":1},"p2":{"len":5}},"p2":{"p1":{"len":5}}},"extenders":{"p2":{"base":"p1","ref":"p0","angle":13.900000000000063,"len":5,"speed":1}},"rotaries":{"p1":"p2"},"groundPoints":{"p0":{"x":1,"y":0,"id":"p0"},"p1":{"x":0,"y":0,"id":"p1"}}};
var State0_State14_State4_State6_State0_State14_State4_State0 = {
  initialSpec: deleteSpec,
  finalSpec: deleteSpec,
  eventLog: [{"handlerName":"onMouseMove","eventData":{"x":1.4,"y":5.5}},{"handlerName":"onMouseDown","eventData":{"x":1.4,"y":5.5}},{"handlerName":"onMouseUp","eventData":{"x":1.4,"y":5.5}},{"handlerName":"onMouseMove","eventData":{"x":9.9,"y":13.6}},{"handlerName":"onMouseDown","eventData":{"x":9.9,"y":13.6}},{"handlerName":"onMouseUp","eventData":{"x":9.9,"y":13.6}},{"handlerName":"onMouseMove","eventData":{"x":14.6,"y":1.7}},{"handlerName":"onMouseDown","eventData":{"x":14.6,"y":1.7}},{"handlerName":"onMouseUp","eventData":{"x":14.6,"y":1.7}},{"handlerName":"onMouseMove","eventData":{"x":10.4,"y":13.2}},{"handlerName":"onMouseDown","eventData":{"x":10.4,"y":13.2}},{"handlerName":"onMouseUp","eventData":{"x":10.4,"y":13.2}},{"handlerName":"onKeyDown","eventData":68},{"handlerName":"onKeyPress","eventData":100},{"handlerName":"onKeyUp","eventData":68},{"handlerName":"onMouseMove","eventData":{"x":35.9,"y":-13.8}}],
};

// make  a four bar with coupler
var State0_State14_State4_State6_State0_State9_State0 = {
  initialSpec: {"points":{"p0":{"p1":{"len":1}},"p1":{"p0":{"len":1},"p2":{"len":5}},"p2":{"p1":{"len":5}}},"extenders":{"p2":{"base":"p1","ref":"p0","angle":7.299999999999982,"len":5,"speed":1}},"rotaries":{"p1":"p2"},"groundPoints":{"p0":{"x":1,"y":0,"id":"p0"},"p1":{"x":0,"y":0,"id":"p1"}}},
  finalSpec: {"points":{"p0":{"p1":{"len":1}},"p1":{"p0":{"len":1},"p2":{"len":5}},"p2":{"p1":{"len":5},"p4":{"len":12.564522752030888},"p5":{"len":9.936616918299022}},"p3":{"p4":{"len":10.165136496870073}},"p4":{"p2":{"len":12.564522752030888},"p3":{"len":10.165136496870073},"p5":{"len":16.32482771731451}},"p5":{"p4":{"len":16.32482771731451},"p2":{"len":9.936616918299022}}},"extenders":{"p2":{"base":"p1","ref":"p0","angle":7.299999999999982,"len":5,"speed":1}},"rotaries":{"p1":"p2"},"groundPoints":{"p0":{"x":1,"y":0,"id":"p0"},"p1":{"x":0,"y":0,"id":"p1"},"p3":{"x":16.7,"y":-0.2,"id":"p3"}}},
  eventLog: [{"handlerName":"onMouseMove","eventData":{"x":3.1,"y":4.3}},{"handlerName":"onMouseDown","eventData":{"x":3.1,"y":4.3}},{"handlerName":"onMouseUp","eventData":{"x":3.1,"y":4.3}},{"handlerName":"onMouseMove","eventData":{"x":14,"y":9.6}},{"handlerName":"onMouseDown","eventData":{"x":14,"y":9.6}},{"handlerName":"onMouseUp","eventData":{"x":14,"y":9.6}},{"handlerName":"onMouseMove","eventData":{"x":16.7,"y":-0.2}},{"handlerName":"onMouseDown","eventData":{"x":16.7,"y":-0.2}},{"handlerName":"onMouseUp","eventData":{"x":16.7,"y":-0.2}},{"handlerName":"onMouseMove","eventData":{"x":7.9,"y":6}},{"handlerName":"onMouseDown","eventData":{"x":7.9,"y":6}},{"handlerName":"onMouseUp","eventData":{"x":7.9,"y":6}},{"handlerName":"onMouseMove","eventData":{"x":6.5,"y":-4.9}},{"handlerName":"onMouseDown","eventData":{"x":6.5,"y":-4.9}},{"handlerName":"onMouseUp","eventData":{"x":6.5,"y":-4.9}},{"handlerName":"onMouseMove","eventData":{"x":35.2,"y":0}}],
};

// make a five bar with two rotaries
var State0_State1_State0_State11_State0_State11_State0_State14_State4_State5_State0 = {
  initialSpec: {"points":{"p0":{"p1":{"len":1}},"p1":{"p0":{"len":1},"p2":{"len":5}},"p2":{"p1":{"len":5}}},"extenders":{"p2":{"base":"p1","ref":"p0","angle":7.99999999999998,"len":5,"speed":1}},"rotaries":{"p1":"p2"},"groundPoints":{"p0":{"x":1,"y":0,"id":"p0"},"p1":{"x":0,"y":0,"id":"p1"}}},
  finalSpec: {"points":{"p0":{"p1":{"len":1}},"p1":{"p0":{"len":1},"p2":{"len":5}},"p2":{"p1":{"len":5},"p6":{"len":13.550305595766215}},"p3":{"p4":{"len":1}},"p4":{"p3":{"len":1},"p5":{"len":5}},"p5":{"p4":{"len":5},"p6":{"len":12.16552506059644}},"p6":{"p2":{"len":13.550305595766215},"p5":{"len":12.16552506059644}}},"extenders":{"p2":{"base":"p1","ref":"p0","angle":7.99999999999998,"len":5,"speed":1},"p5":{"base":"p4","ref":"p3","angle":0.9272952180016122,"speed":1,"len":5}},"rotaries":{"p1":"p2","p4":"p5"},"groundPoints":{"p0":{"x":1,"y":0,"id":"p0"},"p1":{"x":0,"y":0,"id":"p1"},"p3":{"x":13.3,"y":-1.2,"id":"p3"},"p4":{"x":12.3,"y":-1.2,"id":"p4"}}},
  eventLog: [{"handlerName":"onMouseMove","eventData":{"x":12.3,"y":-1.2}},{"handlerName":"onMouseDown","eventData":{"x":12.3,"y":-1.2}},{"handlerName":"onMouseUp","eventData":{"x":12.3,"y":-1.2}},{"handlerName":"onKeyDown","eventData":27},{"handlerName":"onKeyUp","eventData":27},{"handlerName":"onKeyDown","eventData":82},{"handlerName":"onKeyPress","eventData":114},{"handlerName":"onKeyUp","eventData":82},{"handlerName":"onKeyDown","eventData":82},{"handlerName":"onKeyPress","eventData":114},{"handlerName":"onMouseDown","eventData":{"x":12.3,"y":-1.2}},{"handlerName":"onMouseUp","eventData":{"x":12.3,"y":-1.2}},{"handlerName":"onKeyDown","eventData":82},{"handlerName":"onKeyPress","eventData":114},{"handlerName":"onKeyDown","eventData":82},{"handlerName":"onKeyPress","eventData":114},{"handlerName":"onKeyUp","eventData":82},{"handlerName":"onMouseMove","eventData":{"x":15.4,"y":2.6}},{"handlerName":"onMouseDown","eventData":{"x":15.4,"y":2.6}},{"handlerName":"onMouseUp","eventData":{"x":15.4,"y":2.6}},{"handlerName":"onMouseMove","eventData":{"x":-0.6,"y":5}},{"handlerName":"onMouseDown","eventData":{"x":-0.6,"y":5}},{"handlerName":"onMouseUp","eventData":{"x":-0.6,"y":5}},{"handlerName":"onMouseMove","eventData":{"x":9.7,"y":13.6}},{"handlerName":"onMouseDown","eventData":{"x":9.7,"y":13.6}},{"handlerName":"onMouseUp","eventData":{"x":9.7,"y":13.6}},{"handlerName":"onMouseMove","eventData":{"x":35.9,"y":12.3}}],
};

// make a four bar, then move around ground points
var State0_State14_State4_State6_State0_State7_State0_State3_State0 = {
  initialSpec: {"points":{"p0":{"p1":{"len":1}},"p1":{"p0":{"len":1},"p2":{"len":5}},"p2":{"p1":{"len":5}}},"extenders":{"p2":{"base":"p1","ref":"p0","angle":14.150000000000066,"len":5,"speed":1}},"rotaries":{"p1":"p2"},"groundPoints":{"p0":{"x":1,"y":0,"id":"p0"},"p1":{"x":0,"y":0,"id":"p1"}}},
  finalSpec: {"points":{"p0":{"p1":{"len":1}},"p1":{"p0":{"len":1},"p2":{"len":5}},"p2":{"p1":{"len":5},"p4":{"len":13.524215351034957}},"p3":{"p4":{"len":11.237882362794158}},"p4":{"p2":{"len":13.524215351034957},"p3":{"len":11.237882362794158}}},"extenders":{"p2":{"base":"p1","ref":"p0","angle":14.150000000000066,"len":5,"speed":1}},"rotaries":{"p1":"p2"},"groundPoints":{"p0":{"x":0.8,"y":2.5,"id":"p0"},"p1":{"x":-0.2,"y":2.5,"id":"p1"},"p3":{"x":-17.5,"y":3.3,"id":"p3"}}},
  eventLog: [{"handlerName":"onMouseMove","eventData":{"x":0.2,"y":5.1}},{"handlerName":"onMouseDown","eventData":{"x":0.2,"y":5.1}},{"handlerName":"onMouseUp","eventData":{"x":0.2,"y":5.1}},{"handlerName":"onMouseMove","eventData":{"x":12.2,"y":10.7}},{"handlerName":"onMouseDown","eventData":{"x":12.2,"y":10.7}},{"handlerName":"onMouseUp","eventData":{"x":12.2,"y":10.7}},{"handlerName":"onMouseMove","eventData":{"x":14.5,"y":-0.3}},{"handlerName":"onMouseDown","eventData":{"x":14.5,"y":-0.3}},{"handlerName":"onMouseUp","eventData":{"x":14.5,"y":-0.3}},{"handlerName":"onMouseMove","eventData":{"x":-0.2,"y":-0.5}},{"handlerName":"onMouseDown","eventData":{"x":-0.2,"y":-0.5}},{"handlerName":"onMouseMove","eventData":{"x":-0.2,"y":2.5}},{"handlerName":"onMouseUp","eventData":{"x":-0.2,"y":2.5}},{"handlerName":"onMouseMove","eventData":{"x":14.9,"y":-0.7}},{"handlerName":"onMouseDown","eventData":{"x":14.9,"y":-0.7}},{"handlerName":"onMouseMove","eventData":{"x":-17.5,"y":3.3}},{"handlerName":"onMouseUp","eventData":{"x":-17.5,"y":3.3}},{"handlerName":"onMouseMove","eventData":{"x":34.4,"y":-3.1}}],
};

// make a four bar from the canvas
var State0_State1_State2_State0 = {
  initialSpec: {"points":{"p0":{"p1":{"len":1}},"p1":{"p0":{"len":1},"p2":{"len":5}},"p2":{"p1":{"len":5}}},"extenders":{"p2":{"base":"p1","ref":"p0","angle":7.84999999999998,"len":5,"speed":1}},"rotaries":{"p1":"p2"},"groundPoints":{"p0":{"x":1,"y":0,"id":"p0"},"p1":{"x":0,"y":0,"id":"p1"}}},
  finalSpec: {"points":{"p0":{"p1":{"len":1}},"p1":{"p0":{"len":1},"p2":{"len":5}},"p2":{"p1":{"len":5},"p4":{"len":18.463637150668838}},"p3":{"p4":{"len":14.023551618616446}},"p4":{"p2":{"len":18.463637150668838},"p3":{"len":14.023551618616446}}},"extenders":{"p2":{"base":"p1","ref":"p0","angle":7.84999999999998,"len":5,"speed":1}},"rotaries":{"p1":"p2"},"groundPoints":{"p0":{"x":1,"y":0,"id":"p0"},"p1":{"x":0,"y":0,"id":"p1"},"p3":{"x":19.2,"y":4.5,"id":"p3"}}},
  eventLog: [{"handlerName":"onMouseMove","eventData":{"x":19.2,"y":4.5}},{"handlerName":"onMouseDown","eventData":{"x":19.2,"y":4.5}},{"handlerName":"onMouseUp","eventData":{"x":19.2,"y":4.5}},{"handlerName":"onMouseMove","eventData":{"x":13.7,"y":17.4}},{"handlerName":"onMouseDown","eventData":{"x":13.7,"y":17.4}},{"handlerName":"onMouseUp","eventData":{"x":13.7,"y":17.4}},{"handlerName":"onMouseMove","eventData":{"x":0.4,"y":5.2}},{"handlerName":"onMouseDown","eventData":{"x":0.4,"y":5.2}},{"handlerName":"onMouseUp","eventData":{"x":0.4,"y":5.2}},{"handlerName":"onMouseMove","eventData":{"x":33.2,"y":1.5}}],
};

// select a rotary and move it around
var State0_State7_State8_State7_State0 = {
  initialSpec: {"points":{"p0":{"p1":{"len":1}},"p1":{"p0":{"len":1},"p2":{"len":5}},"p2":{"p1":{"len":5}}},"extenders":{"p2":{"base":"p1","ref":"p0","angle":7.549999999999981,"len":5,"speed":1}},"rotaries":{"p1":"p2"},"groundPoints":{"p0":{"x":1,"y":0,"id":"p0"},"p1":{"x":0,"y":0,"id":"p1"}}},
  finalSpec: {"points":{"p0":{"p1":{"len":1}},"p1":{"p0":{"len":1},"p2":{"len":5}},"p2":{"p1":{"len":5}}},"extenders":{"p2":{"base":"p1","ref":"p0","angle":7.549999999999981,"len":5,"speed":1}},"rotaries":{"p1":"p2"},"groundPoints":{"p0":{"x":3.4999999999999982,"y":0.9999999999999921,"id":"p0"},"p1":{"x":2.5,"y":1,"id":"p1"}}},
  eventLog: [{"handlerName":"onMouseMove","eventData":{"x":0,"y":0.1}},{"handlerName":"onMouseDown","eventData":{"x":0,"y":0.1}},{"handlerName":"onMouseUp","eventData":{"x":0,"y":0.1}},{"handlerName":"onMouseDown","eventData":{"x":0,"y":0.1}},{"handlerName":"onMouseMove","eventData":{"x":2.5,"y":1}},{"handlerName":"onMouseUp","eventData":{"x":2.5,"y":1}},{"handlerName":"onMouseMove","eventData":{"x":31.2,"y":-4.6}}],
};

// make four bar from canvas and rotary
var State0_State1_State13_State0 = {
  initialSpec: {"points":{"p0":{"p1":{"len":1}},"p1":{"p0":{"len":1},"p2":{"len":5}},"p2":{"p1":{"len":5}}},"extenders":{"p2":{"base":"p1","ref":"p0","angle":7.249999999999982,"len":5,"speed":1}},"rotaries":{"p1":"p2"},"groundPoints":{"p0":{"x":1,"y":0,"id":"p0"},"p1":{"x":0,"y":0,"id":"p1"}}},
  finalSpec: {"points":{"p0":{"p1":{"len":1}},"p1":{"p0":{"len":1},"p2":{"len":5}},"p2":{"p1":{"len":5},"p4":{"len":15.020110003172254}},"p3":{"p4":{"len":14.467895493125459}},"p4":{"p2":{"len":15.020110003172254},"p3":{"len":14.467895493125459}}},"extenders":{"p2":{"base":"p1","ref":"p0","angle":7.249999999999982,"len":5,"speed":1}},"rotaries":{"p1":"p2"},"groundPoints":{"p0":{"x":1,"y":0,"id":"p0"},"p1":{"x":0,"y":0,"id":"p1"},"p3":{"x":11,"y":1.3,"id":"p3"}}},
  eventLog: [{"handlerName":"onMouseMove","eventData":{"x":11,"y":1.3}},{"handlerName":"onMouseDown","eventData":{"x":11,"y":1.3}},{"handlerName":"onMouseUp","eventData":{"x":11,"y":1.3}},{"handlerName":"onMouseMove","eventData":{"x":3,"y":4.2}},{"handlerName":"onMouseDown","eventData":{"x":3,"y":4.2}},{"handlerName":"onMouseUp","eventData":{"x":3,"y":4.2}},{"handlerName":"onMouseMove","eventData":{"x":12.4,"y":15.7}},{"handlerName":"onMouseDown","eventData":{"x":12.4,"y":15.7}},{"handlerName":"onMouseUp","eventData":{"x":12.4,"y":15.7}},{"handlerName":"onMouseMove","eventData":{"x":34.6,"y":-10.5}}],
};

describe('state behaviors and transitions', function() {
  function runTest(desc, initialSpec, eventLog, finalSpec) {
    it(desc, function () {
      var Linkage = require('../Linkage.js');
      var UI = require('../ui/UI.js');
      var UIState = require('../ui/UIState');

      // copy the initial spec (we expect the linkage to mutate it)
      var linkage = new Linkage(JSON.parse(JSON.stringify(initialSpec)));
      var initialState = UIState.getInitialPausedState(linkage);
      var ui = new UI(initialState, null, []);

      eventLog.forEach(event => ui[event.handlerName](event.eventData));

      expect(ui.state.linkage.spec).toEqual(finalSpec);
    });
  }

  runTest(
    'should do nothing if nothing happens',
    initialSpec,
    [],
    initialSpec
  );

  runTest(
    'should do nothing if only the mouse moves',
    initialSpec,
    mouseMoveEventLog,
    initialSpec
  );

  // mising 10, 12, 13, 15
  var pathTests = {
    State0_State14_State4_State6_State0,
    State0_State14_State4_State6_State0_State14_State4_State0,
    State0_State14_State4_State6_State0_State9_State0,
    State0_State1_State0_State11_State0_State11_State0_State14_State4_State5_State0,
    State0_State14_State4_State6_State0_State7_State0_State3_State0,
    State0_State1_State2_State0,
    State0_State7_State8_State7_State0,
    State0_State1_State13_State0,
  };

  Object.keys(pathTests).forEach(name => {
    runTest(
      name,
      pathTests[name].initialSpec,
      pathTests[name].eventLog,
      pathTests[name].finalSpec
    );
  });
});
