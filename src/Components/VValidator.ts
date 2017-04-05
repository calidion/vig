/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

import { VHTTPBase } from './VHTTPBase';
import * as validator from 'node-form-validator';

export class VValidator extends VHTTPBase {
  defaultPath = 'validators';
  paramKeys = ['required', 'params', 'query', 'body']

  constructor(path = __dirname) {
    super(path)
    this.failurable = true;
  }

  isType(item: any): Boolean {
    if (item instanceof Object) {
      for (var k in item) {
        if (this.paramKeys.indexOf(k) === -1) {
          console.error('params error!');
          return false;
        }
        if (k === 'required') {
          if (!(item[k] instanceof Array)) {
            console.error('required MUST be an array!');
            return false;
          }
        }
      }
    }
    return item instanceof Object || item instanceof Function;
  }

  public process(req, res, next) {
    let handler = this.check(req);
    if (handler instanceof Function) {
      if (this.failurable) {
        var failure = this.getFailure();
        return handler(req, res, this.onPassed(
          req, res, next, failure
        ));
      }
      return handler(req, res, next);
    }
    if (handler && handler instanceof Object) {
      return this.processObject(handler, req, res, next);
    }
    if (next instanceof Function) {
      next(true)
    }
  }

  processObject(handler, req, res, next) {
    req.extracted = {};
    var keys = ['query', 'params', 'body'];
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      // continue when no validation specified
      if (!handler[key]) {
        continue;
      }
      // when no data provided
      req[key] = req[key] || {};
      if (Object.keys(req[key]).length <= 0) {
        // return error when data is required
        if (!(handler.required instanceof Array)) {
          continue;
        }
        if (handler.required.indexOf(key) === -1) {
          continue;
        }
        return this.onPassed(req, res, next, this.failureHandler)(false, new Error(key + ' is required'));
      }
      var result = validator.validate(req[key], handler[key]);
      // return error info when validation failed
      if (!result || result.code !== 0) {
        return this.onPassed(req, res, next, this.failureHandler)(false, result);
      }
      // saved validated data
      req.extracted[key] = result.data;
    }
    if (Object.keys(req.extracted).length <= 0) {
      delete req.extracted;
    }
    next();
  }
}
