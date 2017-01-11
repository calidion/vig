
var EventEmitter = require('events');
var emitter = new EventEmitter();

var events = {
  /**
   * Add an Event Object, which may contain many events and handlers.
   * @param {Object} events - Having to keys:
   *                          1. {Array} names:  events to be listened.
   *                          2. {Object} handlers: key-value pairs, with events and corresponding handlers;
   */
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
  /**
   * Send an event to its listeners
   */
  send: function () {
    emitter.emit.apply(emitter, arguments);
  },
  /**
   * Add an event handler.
   * @param {String} event - Event to be listened.
   * @param {Function} handler - Function to handler the event.
   */
  on: function (event, handler) {
    emitter.on(event, handler);
  }
};
module.exports = events;
