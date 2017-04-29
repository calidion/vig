/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
import { VBase } from "./VBase";

import { HTTP } from "./HTTP";

export class VHTTPBase extends VBase {
  protected failurable = false;
  protected failureHandler: () => void;
  constructor(path = __dirname, failurable = false) {
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
    if (this.data) {
      return this.data[method] || this.data.all;
    }
    return false;
  }

  public setFailureHandler(handler) {
    this.failureHandler = handler;
  }

  public getFailure() {
    return this.failureHandler;
  }

  public process(req, res, next = null) {
    const handler = this.check(req);
    if (handler instanceof Function) {
      if (this.failurable) {
        const failure = this.getFailure();
        return handler(req, res, this.onPassed(
          req, res, next, failure
        ));
      }
      return handler(req, res, next);
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
      if (cb) {
        cb(info, req, res);
      } else {
        this.onAuthorFailed(info, req, res);
      }
    };
  }

  public onAuthorFailed(message, req, res) {
    console.error(message);
    res.status(403).end("Access Denied!");
  }
}
