/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
import { VBase } from './VBase';

import { HTTP } from './HTTP';

export class VHTTPBase extends VBase {
  constructor(path = __dirname) {
    super(path);
    this.filterEnabled = true;
    this.filters = HTTP.methods;
  }

  isType(item: any): Boolean {
    return item instanceof Function;
  }

  public check(req) {
    let method = req.method.toLowerCase();
    return this.data[method] || this.data['all'];
  }

  public process(req, res, next = null) {
    let handler = this.check(req);
    if (handler instanceof Function) {
      return handler(req, res, next);
    }
    if (next instanceof Function) {
      next(true)
    }
  }
}
