/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

import * as _ from 'lodash';
import { Generator } from 'errorable';
import { VBase } from './VBase';

export class VError extends VBase {
  defaultPath = 'errors'
  locale = 'zh-CN'

  constructor(basePath = __dirname, locale = 'zh-CN') {
    super(basePath)
    this.nameless = true;
    this.locale = locale;
  }

  isType(item: any): Boolean {
    return item instanceof Object;
  }

  merge(errors = {}) {
    this.data = _.merge(this.data, errors);
  }

  generate(locale: string = 'zh-CN', filesOnly = true): Object {
    var errors = super.generate();
    if (!filesOnly) {
      errors = _.merge(errors, this.data);
    }
    var generator = new Generator(errors, locale);
    return generator.errors;
  }

  attach(app) {
    console.log(this.data);
    var errors = this.generate(this.locale, false);
    console.log(errors);
    app.use((req, res, next) => {
      console.log('inside attach');
      res.errors = errors;
      next();
    });
  }

}
