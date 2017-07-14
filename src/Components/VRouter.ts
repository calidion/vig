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

  public async run(req, res, scope): Promise<boolean> {
    const handler = this.checkEx(req);
    if (handler) {
      return await this._run(handler, req, res, scope);
    }
    return false;
  }

  protected async _run(func, req, res, scope): Promise<boolean> {
    await func(req, res, scope);
    return true;
  }
}
