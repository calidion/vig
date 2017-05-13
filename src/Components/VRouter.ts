/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
import { VHTTPBase } from "./VHTTPBase";

export class VRouter extends VHTTPBase {
  constructor(path = "") {
    super(path);
    this.defaultPath = "routers";
  }

  public async process(req, res) {
    const handler = this.checkEx(req);
    if (handler) {
      return await Promise.resolve(this._onProcess(handler, req, res));
    }
    return await Promise.resolve(false);
  }
}
