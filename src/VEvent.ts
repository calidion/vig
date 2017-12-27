import * as EventEmitter from "events";
export class VEvent {
  public static getInstance() {
    if (!VEvent.instance) {
      VEvent.instance = new VEvent();
    }
    return VEvent.instance;
  }

  protected static emitter: EventEmitter = new EventEmitter();

  protected static listeners = {};
  protected static onceListeners = {};

  protected static instance;

  protected static VIG_EVENT = "__vig_event";

  private constructor() {
    VEvent.emitter.on(VEvent.VIG_EVENT, async (...args) => {
      await this._onEvent(...args[0]);
    });
  }

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
    for (const name of events.names) {
      const handler = events.handlers[name];
      if (handler) {
        if (isOnce) {
          this._on(name, handler, VEvent.onceListeners);
        } else {
          this._on(name, handler, VEvent.listeners);
        }
      }
      // VEvent.emitter[once](name, handler);
    }
  }

  /**
   * Send an event to its listeners
   */
  public send(...args) {
    VEvent.emitter.emit(VEvent.VIG_EVENT, args);
    // VEvent.emitter.emit.apply(VEvent.emitter, args);
  }

  /**
   * Add an event handler.
   * @param {String} event - Event to be listened.
   * @param {Function} handler - Function to handler the event.
   */
  public on(event, handler) {
    this._on(event, handler, VEvent.listeners);
  }

  /**
   * Add an event handler for one time handling.
   * @param {String} event - Event to be listened.
   * @param {Function} handler - Function to handler the event.
   */
  public once(event, handler) {
    this._on(event, handler, VEvent.onceListeners);
  }

  private _on(event, handler, listeners) {
    if (!handler) {
      return;
    }

    let handlers = listeners[event];

    if (!handlers) {
      handlers = [];
    }
    if (handlers.indexOf(handler) !== -1) {
      return;
    }
    if (handler instanceof Function) {
      handlers.push(handler);
      listeners[event] = handlers;
    }
  }

  private async _processEvent(handlers, params) {
    if (handlers instanceof Array) {
      for (const handler of handlers) {
        await handler.apply(handler, params);
      }
    }
  }

  private async _onEvent(...args) {
    const event = args[0];
    const params = args.splice(1);
    const handlers = VEvent.listeners[event];
    const onceHandlers = VEvent.onceListeners[event];
    VEvent.onceListeners[event] = null;
    await this._processEvent(handlers, params);
    await this._processEvent(onceHandlers, params);
  }
}
