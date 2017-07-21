/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

import { Generator } from "errorable";
import { VBase } from "./VBase";
import * as errorize from "errorable-express";
import * as common from "errorable-common";
import * as _ from "lodash";

export class VError extends VBase {
  protected locale = "zh-CN"

  private cache = null;

  constructor(basePath = "", locale = "zh-CN") {
    super(basePath)
    this.nameless = true;
    this.locale = locale;
    this.defaultPath = "errors";
  }

  public isType(item: any): boolean {
    return item instanceof Object;
  }

  public merge(errors = {}) {
    this.data = Object.assign(this.data, errors);
  }

  public set(data) {
    super.set(data);
    this.cache = null;
  }

  public parse(scope) {
    if (!this.cache) {
      this.cache = this.generate(this.locale, false);
    }
    scope.errors = this.cache;
  }

  public generate(locale: string = "zh-CN", filesOnly = true): object {
    let errors = super.generate();
    if (!filesOnly) {
      errors = _.merge(errors, this.data);
    }

    errors = _.merge(errors, common);

    const generator = new Generator(errors, locale);
    return generator.errors;
  }

  public attach(app) {
    const errors = this.generate(this.locale, false);
    app.use(errorize(errors));
  }

}
