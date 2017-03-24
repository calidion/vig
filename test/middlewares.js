'use strict';
var common = require('errorable-common');
var errorable = require('errorable');
var Generator = errorable.Generator;
var errors = new Generator(common, 'zh-CN').errors;

var assert = require('assert');
var vig = require('../lib');
var request = require('supertest');
var express = require('express');
// var middlewaresHandlers = require('./middlewaresHandlers');
var path = require('path');
var componentPath = path.resolve(__dirname, './component.middleware/');
var componentPath1 = path.resolve(__dirname, './component.middleware.all/');

var service = new vig.VService();
service.addHandler(new vig.VHandler(
  ['/'],
  componentPath,
  '/middlewares'
));

service.addHandler(new vig.VHandler(
  ['/all'],
  componentPath1,
  '/middlewares'
));

var app;

describe('vig #middlewares', function () {
  before(function () {
    app = express();
    vig.normalize(app);
    vig.init(app, errors);
    vig.addHandlers(app, service.toHandlers());
  });
  it('should get /middlewares', function (done) {
    request(app)
      .get('/middlewares')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'mid');
        done();
      });
  });
  it('should get /middlewares', function (done) {
    request(app)
      .get('/middlewares/all')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'all');
        done();
      });
  });
});
