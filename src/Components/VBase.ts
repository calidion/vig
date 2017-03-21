/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

/**
 * Base class for all Components
 */

export class VBase {
  // default path where components can read definitions from
  protected defaultPath = ''
  // Component base directory
  protected basePath = __dirname
  // stored data from specified directory.
  protected data: any = {};

  // files loaded
  protected files: Array<string> = [];

  // data types:
  // named. named by filename
  // nameless. merged by object
  protected nameless = false;

  constructor(path = __dirname) {
    this.basePath = path;
  }

  get() {
    return this.data;
  }

  getFiles() {
    return this.files;
  }

  reset() {
    this.data = {};
    this.files = [];
  }

  addFile(file: string = '') {
    if (fs.existsSync(file)) {
      this.files.push(file);
    }
  }

  getFile(file: string): Object {
    if (fs.existsSync(file)) {
      var json = require(file);
      return json;
    }
    return null;
  }

  extends(name: string, json: Object, data: any = {}) {
    if (this.nameless) {
      data = _.merge(this.data, json);
    } else {
      data[name] = json;
    }
    return data;
  }

  generate(data = {}) {
    this.files.forEach(file => {
      const json = require(file);
      const name = path.basename(file, path.extname(file))
      data = this.extends(name, json, data);
    });
    return data;
  }

  load(dir = '', data = {}) {
    const allowedExtensions = ['.js', '.ts', '.json'];
    if (!dir) {
      dir = path.resolve(this.basePath, this.defaultPath);
    } else {
      if (!fs.existsSync(dir)) {
        return null;
      }
    }

    let files = fs.readdirSync(dir);
    files.forEach((file) => {
      let absPath = path.resolve(dir, file);
      let stat = fs.statSync(absPath);
      // ignore directories
      if (stat && stat.isDirectory()) {
        return;
      }
      // read from only valid extensions
      if (allowedExtensions.indexOf(path.extname(file)) === -1) {
        return;
      }
      this.files.push(absPath);
      const json = require(absPath);
      const name = path.basename(absPath, path.extname(absPath))
      data = this.extends(name, json, data);
    });
    return data;
  }
};
