'use strict';
var path = require('path');
var errorize = require('errorable-express');

var skipper = require('skipper');
var bodyParser = require('body-parser');
var dirLoader = require('../dest/src');
var models = require('./models');
var uploader = new dirLoader.VFile();
var vig = {
  VService: dirLoader.VService,
  VHandler: dirLoader.VHandler,
  _handlers: [],
  events: new dirLoader.VEvent(),
  models: models,
  VFile: dirLoader.VFile,
  include: function (dir, requires) {
    dir = path.dirname(dir) + '/';
    for (var i = 0; i < requires.length; i++) {
      vig._handlers = vig._handlers.concat(require(dir + requires[i]));
    }
  },
  enable: function (app) {
    vig.addHandlers(app, vig._handlers);
  },
  normalize: function (app) {
    // parse raw xml data
    app.use(bodyParser.raw({
      type: 'text/xml'
    }));

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({
      extended: false
    }));

    // enabled file uploading
    app.use(skipper());
    app.use(uploader.use());
  },
  init: function (app, errors) {
    vig.normalize(app);
    if (errors) {
      vig.errorize(app, errors);
    }
    // be careful about the order, should not be changed
    vig.modelize(app);
  },
  modelize: function (app) {
    app.use(function (req, res, next) {
      req.models = {};
      if (models._models) {
        req.models = models._models;
      }
      next();
    });
  },
  errorize: function (app, errors) {
    app.use(errorize(errors));
  },
  addHandlers: function (app, handlers) {
    for (var i = 0; i < handlers.length; i++) {
      console.log(handlers[i]);
      var handler = new dirLoader.VHandler(
        handlers[i].urls,
        __dirname,
        handlers[i].prefix
      );
      handler.set(handlers[i]);
      handler.attach(app);
    }
  }
};

module.exports = vig;
