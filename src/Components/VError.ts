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

  constructor(basePath = __dirname) {
    super(basePath)
    this.nameless = true;
  }

  set(data) {
    this.data = data;
  }

  isType(item: any): Boolean {
    return item instanceof Object;
  }

  generate(locale: string = 'zh-CN', filesOnly = true): Object {
    var errors = super.generate();
    if (!filesOnly) {
      errors = _.merge(errors, this.data);
    }
    var generator = new Generator(errors, locale);
    return generator.errors;
  }
}
