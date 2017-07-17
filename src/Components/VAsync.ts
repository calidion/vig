/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
import { VHTTPBase } from "./VHTTPBase";

/**
 * Middleware class
 * Handles:
 * 1. parser => parsing all input data
 * 2. authenticator => authenticating all the requests
 * 3. validator =>  validator all input data
 * 4. pager => extracting pagination info
 */

export class VAsync extends VHTTPBase {
  constructor(path) {
    super(path)
    this.defaultPath = "asyncs";
  }

  public checkEx(req, scope) {
    const method = req.method.toLowerCase();
    const handler = this.data[method] || this.data.all;
    if (handler instanceof Array) {
      return handler;
    }
    if (handler instanceof Function) {
      return handler;
    }
  }

  public async run(req, res, scope) {
    const handler = this.checkEx(req, scope);
    if (handler instanceof Function) {
      await handler(req, res, scope);
    }
    if (handler instanceof Array) {
      for (let i = 0; i < handler.length; i++) {
        const f = handler[i];
        await f(req, res, scope);
      }
    }
  }
}
