/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

import { VBase } from "./VBase";

export class VWebSocket extends VBase {
  constructor(path) {
    super(path)
    this.defaultPath = "websockets";
  }

  public isType(item: any): boolean {
    return item instanceof Function;
  }

  public async run(event, message, ws, scope) {
    const eh = this.get();
    const handler = eh[event];
    if (!(handler instanceof Function)) {
      return;
    }
    return await handler(message, ws, scope);
  }
}
