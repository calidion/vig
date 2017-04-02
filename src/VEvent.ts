import * as EventEmitter from 'events';
export class VEvent {
  protected static emitter: EventEmitter = new EventEmitter();

  /**
   * Add an Event Object, which may contain many events and handlers.
   * @param {Object} events - Having to keys:
   *                          1. {Array} names:  events to be listened.
   *                          2. {Object} handlers: key-value pairs, with events and corresponding handlers;
   * @param {Boolean} isOnce - once or not
   */
  add(events, isOnce = true) {
    let once = isOnce ? 'once' : 'on';
    if (events && events.names && events.handlers) {
      for (var i = 0; i < events.names.length; i++) {
        var name = events.names[i];
        var handler = events.handlers[name];
        if (name && handler) {
          VEvent.emitter[once](name, handler);
        }
      }
    }
  }

  /**
   * Send an event to its listeners
   */
  send() {
    VEvent.emitter.emit.apply(VEvent.emitter, arguments);
  }

  /**
   * Add an event handler.
   * @param {String} event - Event to be listened.
   * @param {Function} handler - Function to handler the event.
   */
  on(event, handler) {
    VEvent.emitter.on(event, handler);
  }

  /**
 * Add an event handler for one time handling.
 * @param {String} event - Event to be listened.
 * @param {Function} handler - Function to handler the event.
 */
  once(event, handler) {
    VEvent.emitter.once(event, handler);
  }

};
