/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

import * as fs from 'fs';
import * as _ from 'lodash';
import { Generator } from 'errorable';

export class VError {
  files: Array<string> = []
  locale = 'zh-CN'
  errors = {}

  constructor() {

  }
  reset() {
    this.errors = {};
    this.files = [];
  }
  addFile(file: string = '') {
    if (fs.existsSync(file)) {
      this.files.push(file);
    }
  }
  extends(errors: Object) {
    this.errors = _.merge(this.errors, errors);
  }
  getFile(file: string): Object {
    if (fs.existsSync(file)) {
      var json = require(file);
      return json;
    }
  }
  generate(locale: string = 'zh-CN', filesOnly = true): Object {
    var errors = {};
    for (var i = 0; i < this.files.length; i++) {
      var error = this.getFile(this.files[i]);
      errors = _.merge(errors, error);
    }
    if (!filesOnly) {
      errors = _.merge(errors, this.errors);
    }
    var generator = new Generator(errors, locale);
    return generator.errors;
  }
}
