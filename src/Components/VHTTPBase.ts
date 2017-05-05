/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
import { VBase } from "./VBase";

import { HTTP } from "./HTTP";

export class VHTTPBase extends VBase {
  protected failurable = false;
  protected failureHandler: () => void;
  constructor(path = "", failurable = false) {
    super(path);
    this.filterEnabled = true;
    this.failurable = failurable;
    this.filters = HTTP.methods;
  }

  public isType(item: any): boolean {
    return item instanceof Function;
  }

  public check(req) {
    const method = req.method.toLowerCase();
    return this.data[method] || this.data.all;
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

  public getFailure() {
    return this.failureHandler;
  }

  public process(req, res, next = null) {
    const handler = this.check(req);
    if (handler instanceof Function) {
      return this._onProcess(handler, req, res, next);
    }
    if (typeof handler === "string" && req[this.defaultPath] && req[this.defaultPath][handler]) {
      const func = req[this.defaultPath][handler];
      if (func instanceof Function) {
        return this._onProcess(func, req, res, next);
      }
    }
    if (next instanceof Function) {
      next(true)
    }
  }

  public onPassed(req, res, next, cb) {
    return (passed, info) => {
      if (passed === true) {
        return next();
      }
      console.log(req.fallbacks);
      if (cb instanceof Function) {
        cb(info, req, res);
      } else if (req.fallbacks && req.fallbacks[cb] && req.fallbacks[cb] instanceof Function) {
        const func = req.fallbacks[cb];
        func(info, req, res);
      } else {
        this.onAuthorFailed(info, req, res);
      }
    };
  }

  public onAuthorFailed(message, req, res) {
    console.error(message);
    res.status(403).end("Access Denied!");
  }

  protected _onProcess(func, req, res, next) {
    if (this.failurable) {
      const failure = this.getFailure();
      return func(req, res, this.onPassed(
        req, res, next, failure
      ));
    }
    return func(req, res, next);
  }
}
