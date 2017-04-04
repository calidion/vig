/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

import * as _ from 'lodash';
import { Generator } from 'errorable';
import { VBase } from './VBase';
import * as Waterline from 'waterline';

export class VModel extends VBase {
  defaultPath = 'models'
  constructor(basePath = __dirname) {
    super(basePath)
  }

  isType(item: any): Boolean {
    return item.attributes instanceof Object;
  }

  attach(app, models) {
    app.use(function (req, res, next) {
      req.models = models || {};
      next();
    });
  }

  init(config, options, next) {
    var waterline = new Waterline();
    var data: any = this.load();

    for (var key in data) {
      var model = data[key];
      for (var k in options) {
        if (typeof k === 'string') {
          model[k] = options[k];
        }
      }
      var connection = Waterline.Collection.extend(model);
      waterline.loadCollection(connection);
    }

    waterline.initialize(config, (error, ontology) => {
      if (error) {
        return next(true, null);
      }
      var results = {};
      for (var key in data) {
        results[key] = ontology.collections[data[key].identity];
      }
      return next(false, results);
    });
  }
}
