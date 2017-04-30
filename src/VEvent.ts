import * as EventEmitter from "events";
export class VEvent {
  protected static emitter: EventEmitter = new EventEmitter();

  /**
   * Add an Event Object, which may contain many events and handlers.
   * @param {Object} events - Having to keys:
   *                          1. {Array} names:  events to be listened.
   *                          2. {Object} handlers: key-value pairs, with events and corresponding handlers;
   * @param {Boolean} isOnce - once or not
   */
  public add(events, isOnce = true) {
    const once = isOnce ? "once" : "on";
    if (!events) {
      return;
    }
    if (!events.names) {
      return;
    }
    if (!events.handlers) {
      return;
    }
    for (let i = 0; i < events.names.length; i++) {
      const name = events.names[i];
      const handler = events.handlers[name];
      if (!handler) {
        continue;
      }
      VEvent.emitter[once](name, handler);
    }
  }

  /**
   * Send an event to its listeners
   */
  public send(...args) {
    VEvent.emitter.emit.apply(VEvent.emitter, args);
  }

  /**
   * Add an event handler.
   * @param {String} event - Event to be listened.
   * @param {Function} handler - Function to handler the event.
   */
  public on(event, handler) {
    VEvent.emitter.on(event, handler);
  }

  /**
   * Add an event handler for one time handling.
   * @param {String} event - Event to be listened.
   * @param {Function} handler - Function to handler the event.
   */
  public once(event, handler) {
    VEvent.emitter.once(event, handler);
  }
}
