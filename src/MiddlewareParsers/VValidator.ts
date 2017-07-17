/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

import { VHTTPBase } from "../Components/VHTTPBase";
import * as validator from "node-form-validator";

export class VValidator extends VHTTPBase {
  private paramKeys = ["required", "params", "query", "body"]

  constructor(path = "") {
    super(path)
    this.failurable = true;
    this.defaultPath = "validators";
  }

  public isType(item: any): boolean {
    if (item instanceof Object) {
      for (const k in item) {
        if (typeof k === "string") {
          if (this.paramKeys.indexOf(k) === -1) {
            return false;
          }
          if (k === "required") {
            if (!(item[k] instanceof Array)) {
              return false;
            }
          }
        }
      }
    }
    return item instanceof Object || item instanceof Function;
  }

  public async process(req, res, scope = null): Promise<boolean> {
    const handler = this.check(req);
    if (handler instanceof Function) {
      return await Promise.resolve(this._onProcess(handler, req, res, scope));
    }
    if (handler && handler instanceof Object) {
      const processed: boolean = this.processObject(handler, req, res, scope);
      return await Promise.resolve(processed);
    }
    return await Promise.resolve(true);
  }

  public processObject(handler, req, res, scope): boolean {
    req.extracted = {};
    const keys = ["query", "params", "body"];
    const fallback = this.getFallback(req, scope);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

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
        return this.onPassed(req, res, scope, fallback)(false, new Error(key + " is required"));
      }
      const result = validator.validate(req[key], handler[key]);
      // return error info when validation failed
      if (!result || result.code !== 0) {
        return this.onPassed(req, res, scope, fallback)(false, result);
      }
      // saved validated data
      req.extracted[key] = result.data;
    }
    if (Object.keys(req.extracted).length <= 0) {
      delete req.extracted;
    }
    return true;
  }
}
