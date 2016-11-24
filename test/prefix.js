'use strict';
var common = require('errorable-common');
var errorable = require('errorable');
var Generator = errorable.Generator;
var errors = new Generator(common, 'zh-CN').errors;

var assert = require('assert');
var vig = require('../lib');
var request = require('supertest');
var express = require('express');
var prefixHandlers = require('./prefixHandlers');
var app;

describe('vig #prefix', function () {
  before(function () {
    app = express();
    vig.normalize(app);
    vig.init(app, errors);
    vig.addHandlers(app, prefixHandlers);
  });
  it('should get /prefix/:id', function (done) {
    request(app)
      .post('/prefix/100')
      .expect(200)
      .end(function (err, res) {
        console.log(err);
        assert(!err);
        assert(res.text === 'prefix100');
        done();
      });
  });
});
