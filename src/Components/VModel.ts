/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

import * as _ from "lodash";
import { Generator } from "errorable";
import { VBase } from "./VBase";
import * as Waterline from "waterline";

export class VModel extends VBase {
  constructor(basePath = "") {
    super(basePath)
    this.defaultPath = "models";
  }

  public isType(item: any): boolean {
    return item.attributes instanceof Object;
  }

  public attach(app, models) {
    app.use((req, res, next) => {
      req.models = models || {};
      next();
    });
  }

  public init(config, options, next) {
    const waterline = new Waterline();
    const data: any = this.load();
    for (const key in data) {
      if (typeof key === "string") {
        const model = data[key];
        for (const k in options) {
          if (typeof k === "string") {
            model[k] = options[k];
          }
        }
        const connection = Waterline.Collection.extend(model);
        waterline.loadCollection(connection);
      }
    }

    waterline.initialize(config, (error, ontology) => {
      if (error) {
        return next(true, null);
      }
      const results = {};
      for (const key in data) {
        if (typeof key === "string") {
          results[key] = ontology.collections[data[key].identity];
        }
      }
      return next(false, results);
    });
  }
}
