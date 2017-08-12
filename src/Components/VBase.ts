/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

import * as fs from "fs";
import * as path from "path";
import { promisify } from "bluebird";

/**
 * Base class for all Components
 */

export abstract class VBase {

  // Default path where components can read definitions from
  protected defaultPath = ""

  // Component base directory
  protected basePath = ""

  // Stored data from specified directory.
  protected data: any = {};

  // files loaded
  protected files: string[] = [];

  // data types:
  // named:       named by filename
  // nameless:    merged by object
  protected nameless = false;

  // Filter enabled to ignore files whose names are not in array filters.
  protected filterEnabled = false;

  // Names should be filtered.
  protected filters: string[] = [];

  // Alloed extensions

  protected allowedExt = [".js", ".ts", ".json"];

  constructor(path: string) {
    this.basePath = path;
  }

  public toAsync(cb, self) {
    const pcb = promisify(cb);
    return async (...args) => {
      await pcb.apply(self, args);
    }
  }

  public toMethods() {
    const json = {
      methods: []
    };
    for (const key of Object.keys(this.data)) {
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
      data = Object.assign(this.data, json);
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

  // public filter() {
  //   if (!this.filterEnabled) {
  //     return;
  //   }
  //   this.files = this.files.map((file) => {
  //     return this._filter(file);
  //   });
  // }

  public loadOn() {
    this.set(this.load());
  }

  public parseDir(dir = "") {
    if (fs.existsSync(dir)) {
      return dir;
    }
    return false;
  }

  public parseFile(dir, file) {
    const absPath = path.resolve(dir, file);
    const stat = fs.statSync(absPath);
    // ignore directories
    if (stat && stat.isDirectory()) {
      return false;
    }
    // read from valid extensions only
    if (this.allowedExt.indexOf(path.extname(file)) === -1) {
      return false;
    }
    if (this.filterEnabled && !this._filter(absPath)) {
      return false;
    }
    const loaded = require(absPath);
    if (!this.isType(loaded)) {
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

  // public addDir(dir) {
  //   this.dirReader(dir, (realDir, file) => {
  //     const parsed = this.parseFile(realDir, file);
  //     if (!parsed) {
  //       return;
  //     }
  //     // this.files.push(parsed.path);
  //   });
  // }

  public load(dir: any = "", data = {}) {
    if (!dir) {
      dir = path.resolve(this.basePath, this.defaultPath);
    }
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

  protected _filter(file: string) {
    const name = path.basename(file, path.extname(file))
    if (this.filters.indexOf(name) !== -1) {
      return file
    }
    return null;
  }

  // Define types able to be parsed
  protected abstract isType(item: any): boolean;
}
