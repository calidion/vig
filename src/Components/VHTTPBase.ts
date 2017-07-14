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
    return item instanceof Function;
  }

  public check(req) {
    const method = req.method.toLowerCase();
    return this.data[method] || this.data.all;
  }

  public checkEx(req) {
    const method = req.method.toLowerCase();
    const handler = this.data[method] || this.data.all;
    if (handler instanceof Function) {
      return handler;
    }
    if (typeof handler !== "string") {
      return false;
    }

    if (!req[this.defaultPath]) {
      return false;
    }

    if (!req[this.defaultPath][handler]) {
      return false;
    }

    if (req[this.defaultPath][handler] instanceof Function) {
      return req[this.defaultPath][handler];
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

  public getFallback(req) {
    const handler: any = this.failureHandler;
    if (handler instanceof Function) {
      return handler;
    }
    if (typeof handler !== "string") {
      return false;
    }
    if (!req.fallbacks) {
      return false;
    }
    if (!req.fallbacks[handler]) {
      return false
    }
    if (!(req.fallbacks[handler] instanceof Function)) {
      return false;
    }
    return req.fallbacks[handler];
  }

  public async process(req, res): Promise<boolean> {
    const handler = this.checkEx(req);
    if (handler) {
      const processed: boolean = await this._onProcess(handler, req, res);
      return await Promise.resolve(processed);
    }
    return await Promise.resolve(true);
  }

  public onPassed(req, res, cb) {
    return (passed, info): boolean => {
      if (cb instanceof Function) {
        return cb(info, req, res);
      } else {
        return this.onAuthorFailed(info, req, res);
      }
    };
  }

  public onAuthorFailed(message, req, res): boolean {
    // console.error(message);
    res.status(403).end("Access Denied!");
    return false;
  }

  protected _onProcess(func, req, res): Promise<boolean> {
    return new Promise((resovle) => {
      func(req, res, (passed, info) => {
        if (!this.failurable || passed) {
          return resovle(true);
        }
        const falback = this.getFallback(req);
        if (falback instanceof Function) {
          falback(info, req, res);
        } else {
          this.onAuthorFailed(info, req, res);
        }
        resovle(false);
      });
    });
  }
}
