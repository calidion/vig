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
    console.log(handler);
    console.log('inside process object');
    console.log(req.body);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      console.log(key);
      console.log(handler[key]);
      console.log(req[key]);

      // continue when no validation specified
      if (!handler[key]) {
        console.log('inside process object 1');
        continue;
      }
      // when no data provided
      req[key] = req[key] || {};
      if (Object.keys(req[key]).length <= 0) {
        // var required = false;
        // for (var k in handler[key]) {
        //   if (handler[key][k].required) {
        //     required = true;
        //     break;
        //   }
        // }
        // if (!required) {
          // return error when data is required
          if (!(handler.required instanceof Array)) {
            console.log('inside process object 2');
            continue;
          }
          if (handler.required.indexOf(key) === -1) {
            console.log('inside process object 3');

            continue;
          }
          console.log('inside process object 4');

          return this.onPassed(req, res, next, this.failureHandler)(false, new Error(key + ' is required'));
        // }
      }
      console.log('inside process object 5');

      var result = validator.validate(req[key], handler[key]);
      console.log(result);
      // return error info when validation failed
      if (!result || result.code !== 0) {
        console.log('inside process object 6');

        return this.onPassed(req, res, next, this.failureHandler)(false, result);
      }
      // saved validated data
      req.extracted[key] = result.data;
    }
    if (Object.keys(req.extracted).length <= 0) {
      delete req.extracted;
    }
    console.log('inside process object 7');

    next();
  }
}
