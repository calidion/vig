'use strict';
var common = require('errorable-common');
var errorable = require('errorable');
var Generator = errorable.Generator;
var errors = new Generator(common, 'zh-CN').errors;

var assert = require('assert');
var vig = require('../lib');
var request = require('supertest');
var express = require('express');
var errorsHandlers = require('./errorsHandlers');
var app;

describe('vig #errors', function () {
  before(function () {
    app = express();
    vig.init(app, errors);
    vig.addHandlers(app, errorsHandlers);
  });
  it('should get /errors', function (done) {
    request(app)
      .get('/errors')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert.deepEqual(res.body, errors.Success.restify());
        done();
      });
  });
  it('should get /errors', function (done) {
    request(app)
      .post('/errors')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert.deepEqual(res.body, errors.Failure.restify());
        done();
      });
  });
});

