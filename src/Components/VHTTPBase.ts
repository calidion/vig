/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
import { VBase } from "./VBase";

import { HTTP } from "./HTTP";

export class VHTTPBase extends VBase {
  protected failurable = false;
  protected failureHandler: () => void;
  constructor(path) {
    super(path);
    this.filterEnabled = true;
    this.filters = HTTP.methods;
  }

  public isType(item: any): boolean {
    return item instanceof Function || item instanceof Array;
  }

  public check(req) {
    const method = req.method.toLowerCase();
    return this.data[method] || this.data.all;
  }

  public checkEx(req, scope) {
    const method = req.method.toLowerCase();
    const handler = this.data[method] || this.data.all;
    if (handler instanceof Function) {
      return handler;
    }

    if (handler instanceof Array) {
      return handler;
    }

    if (typeof handler !== "string") {
      return false;
    }
    return this.getDefinition(handler, this.defaultPath, scope);
  }

  public getDefinition(handler, name, scope) {
    const definitions = scope.definitions;
    const namedHandler = definitions[name];
    if (!namedHandler) {
      return false;
    }

    const result = namedHandler[handler];
    if (!result) {
      return false;
    }

    if (result instanceof Function) {
      return result;
    }
    return false;
  }

  public setFailureHandler(handler) {
    this.failureHandler = handler;
  }

  public extend(method, handler) {
    if (!(handler instanceof Function)) {
      return false;
    }
    if (this.filters.indexOf(method) === -1) {
      return false;
    }
    this.data[method] = handler;
    return true;
  }

  public getFallback(req, scope) {
    const handler: any = this.failureHandler;
    if (handler instanceof Function) {
      return handler;
    }
    if (typeof handler !== "string") {
      return false;
    }
    return this.getDefinition(handler, "fallbacks", scope);
  }

  public async process(req, res, scope): Promise<boolean> {
    const handler = this.checkEx(req, scope);
    if (handler instanceof Function) {
      const processed: boolean = await this._onProcess(handler, req, res, scope);
      return processed;
    }
    if (handler instanceof Array) {
      for (const f of handler) {
        const processed: boolean = await this._onProcess(f, req, res, scope);
        if (!processed) {
          return false;
        }
      }
    }
    return true;
  }

  public async onPassed(req, res, scope, info, cb) {
    if (cb instanceof Function) {
      return await cb(info, req, res, scope);
    } else {
      return this.onAuthorFailed(info, req, res, scope);
    }
  }

  public onAuthorFailed(message, req, res, scope): boolean {
    res.status(403).end("Access Denied!");
    return false;
  }

  protected async _onProcess(func, req, res, scope): Promise<boolean> {
    const passed = await func(req, res, scope);
    if (!this.failurable || passed) {
      return true;
    }
    const falback = this.getFallback(req, scope);
    if (falback instanceof Function) {
      falback(true, req, res, scope);
    } else {
      this.onAuthorFailed(true, req, res, scope);
    }
    return false;
  }
}
