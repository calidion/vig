/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

import * as nunjucks from "nunjucks";
import * as path from "path";
import * as fs from "fs";
import * as _ from "lodash";

import * as debug from "debug";

const print = debug("VTemplate");

import { VBase } from "../Components/VBase";
import { Filter } from "./Filter";

export class VTemplate extends VBase {
  protected initialized: boolean = false;
  protected tFilter: Filter;
  protected views = [];
  protected parent: VTemplate;
  protected env;
  constructor(dir) {
    super(dir);
    this.defaultPath = "templates";
    const resolvedPath = path.resolve(dir, "./templates");
    this.views.push(path.resolve(resolvedPath, "./views"));
    this.tFilter = new Filter(resolvedPath);
  }

  public isType(item: any): boolean {
    return true;
  }

  public getEnv() {
    if (this.initialized) {
      return this.env;
    }
    const views = this.getViews();
    const loader = new nunjucks.FileSystemLoader(views);
    const env = new nunjucks.Environment(loader, {
      autoescape: false
    });
    const filters = this.getFilters();
    for (const key of Object.keys(filters)) {
      env.addFilter(key, filters[key]);
    }
    this.env = env;
    this.initialized = true;
    return env;
  }

  public render(data, template, ext = "html") {
    return this.getEnv().render(template + "." + ext, data);
  }

  public setParent(p: VTemplate) {
    this.parent = p;
    this.initialized = false;
  }

  public getFilters() {
    this.tFilter.loadOn();
    const filters = this.tFilter.get();
    if (!this.parent) {
      return filters;
    }
    const parent = this.parent.getFilters();
    return _.merge(parent, filters);
  }

  public getViews() {
    if (!this.parent) {
      return this.views;
    }
    const views = this.parent.getViews();
    return views.concat(this.views);
  }
}
