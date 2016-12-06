'use strict';
var common = require('errorable-common');
var errorable = require('errorable');
var Generator = errorable.Generator;
var errors = new Generator(common, 'zh-CN').errors;

var assert = require('assert');
var vig = require('../lib');
var request = require('supertest');
var express = require('express');
var middlewaresHandlers = require('./middlewaresHandlers');
var app;

describe('vig #middlewares', function () {
  before(function () {
    app = express();
    vig.normalize(app);
    vig.init(app, errors);
    vig.addHandlers(app, middlewaresHandlers);
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
