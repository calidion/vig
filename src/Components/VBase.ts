/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

import * as fs from "fs";
import * as path from "path";
import * as _ from "lodash";

/**
 * Base class for all Components
 */

export abstract class VBase {
  // default path where components can read definitions from
  protected defaultPath = ""
  // Component base directory
  protected basePath = __dirname
  // stored data from specified directory.
  protected data: any = {};

  // files loaded
  protected files: string[] = [];

  // data types:
  // named:       named by filename
  // nameless:    merged by object
  protected nameless = false;

  protected filterEnabled = false;

  protected filters: string[] = [];

  constructor(path: string) {
    this.basePath = path;
  }

  public toMethods() {
    const json = {
      methods: []
    };
    const keys = Object.keys(this.data);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      json.methods.push(key);
      json[key] = this.data[key];
    }
    return json;
  }

  public get() {
    return this.data;
  }

  public set(data) {
    if (!data) {
      return;
    }
    this.data = data;
  }

  public getFiles() {
    return this.files;
  }

  public reset() {
    this.data = {};
    this.files = [];
  }

  public attach(app, extra = null) {
    app.use(this._attachToRequest())
  }

  public addFile(file: string = "") {
    if (fs.existsSync(file)) {
      this.files.push(file);
    }
  }

  public getFile(file: string): object {
    if (fs.existsSync(file)) {
      const json = require(file);
      return json;
    }
    return null;
  }

  public extends(name: string, json: object, data: any = {}) {
    if (this.nameless) {
      data = _.merge(this.data, json);
    } else {
      data[name] = json;
    }
    return data;
  }

  public generate(data = {}) {
    this.files.forEach((file) => {
      const json = require(file);
      const name = path.basename(file, path.extname(file))
      data = this.extends(name, json, data);
    });
    return data;
  }

  public filter() {
    if (!this.filterEnabled) {
      console.warn("Filter is not enabled!");
      return;
    }
    this.files = this.files.map((file) => {
      return this._filter(file);
    });
  }

  public loadOn() {
    this.set(this.load());
  }

  public parseDir(dir = "") {
    if (!this.basePath) {
      return false;
    }
    if (!dir) {
      dir = path.resolve(this.basePath, this.defaultPath);
    }
    if (!fs.existsSync(dir)) {
      console.error("Directory:[" + dir + "] not exists!");
      return false;
    }
    return dir;
  }

  public parseFile(dir, file) {
    const absPath = path.resolve(dir, file);
    const stat = fs.statSync(absPath);
    // ignore directories
    if (stat && stat.isDirectory()) {
      console.warn("Directory:" + absPath + " is ignored!");
      return false;
    }
    // read from valid extensions only
    const allowedExtensions = [".js", ".ts", ".json"];
    if (allowedExtensions.indexOf(path.extname(file)) === -1) {
      console.warn("File:" + absPath + " is ignored!");
      return false;
    }
    if (this.filterEnabled && !this._filter(absPath)) {
      return false;
    }
    const loaded = require(absPath);
    if (!this.isType(loaded)) {
      console.warn("Type is not match!");
      return false;
    }
    return { path: absPath, loaded };
  }

  public dirReader(dir, iterator) {
    dir = this.parseDir(dir);
    if (dir) {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        return iterator(dir, file);
      });
      this.files = this.files.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
    }
    return dir;
  }

  public addDir(dir) {
    this.dirReader(dir, (realDir, file) => {
      const parsed = this.parseFile(realDir, file);
      if (!parsed) {
        return;
      }
      this.files.push(parsed.path);
    });
  }

  public load(dir: any = "", data = {}) {
    if (this.dirReader(dir, (realDir, file) => {
      const parsed = this.parseFile(realDir, file);
      if (!parsed) {
        return;
      }
      this.files.push(parsed.path);
      const name = path.basename(parsed.path, path.extname(parsed.path))
      data = this.extends(name, parsed.loaded, data);
    })) {
      return data;
    }
  }

  protected _attachToRequest() {
    return (req, res, next) => {
      req[this.defaultPath] = this.data;
      next();
    };
  }

  protected _filter(file: string) {
    const name = path.basename(file, path.extname(file))
    if (this.filters.indexOf(name) !== -1) {
      return file
    }
    console.warn("File filtered :" + file);
    return null;
  }
  protected abstract isType(item: any): boolean;
}
