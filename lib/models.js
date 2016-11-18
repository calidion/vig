'use strict';
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var Waterline = require('waterline');

var models = {
  _list: [],
  _waterline: null,
  _onInit: function (next) {
    return function (error, ontology) {
      if (error) {
        return next(true, null);
      }
      var results = {};
      for (var i = 0; i < models._list.length; i++) {
        var model = models._list[i];
        var name = model.name;
        results[name] = ontology.collections[model.identity];
      }
      return next(false, results);
    };
  },
  addDir: function (dir) {
    var files = fs.readdirSync(dir);
    for (var i = 0; i < files.length; i++) {
      var name = path.basename(files[i], '.js');
      var model = _.extend({}, require(dir + '/' + name));
      model.name = name;
      model.identity = name.toLowerCase();
      models._list.push(model);
    }
  },
  init: function (config, options, next) {
    var waterline = new Waterline();
    for (var i = 0; i < models._list.length; i++) {
      var model = models._list[i];
      for (var k in options) {
        if (typeof k === 'string') {
          model[k] = options[k];
        }
      }
      var connection = Waterline.Collection.extend(model);
      waterline.loadCollection(connection);
    }
    console.log('end init');
    waterline.initialize(config, models._onInit(next));
  }
};
module.exports = models;
