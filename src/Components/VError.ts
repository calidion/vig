/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

import * as _ from "lodash";
import { Generator } from "errorable";
import { VBase } from "./VBase";
import * as errorize from "errorable-express";

export class VError extends VBase {
  protected locale = "zh-CN"

  constructor(basePath = __dirname, locale = "zh-CN") {
    super(basePath)
    this.nameless = true;
    this.locale = locale;
    this.defaultPath = "errors";
  }

  public isType(item: any): boolean {
    return item instanceof Object;
  }

  public merge(errors = {}) {
    this.data = _.merge(this.data, errors);
  }

  public generate(locale: string = "zh-CN", filesOnly = true): object {
    let errors = super.generate();
    if (!filesOnly) {
      errors = _.merge(errors, this.data);
    }
    const generator = new Generator(errors, locale);
    return generator.errors;
  }

  public attach(app) {
    const errors = this.generate(this.locale, false);
    app.use(errorize(errors));
  }

}
