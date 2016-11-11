
var EventEmitter = require('events');
var emitter = new EventEmitter();

var events = {
  add: function (events) {
    if (events && events.names && events.handlers) {
      for (var i = 0; i < events.names.length; i++) {
        var name = events.names[i];
        var handler = events.handlers[name];
        if (name && handler) {
          emitter.on(name, handler);
        }
      }
    }
  },
  send: function () {
    emitter.emit.apply(emitter, arguments);
  }
};
module.exports = events;
