'use strict';
var common = require('errorable-common');
var errorable = require('errorable');
var Generator = errorable.Generator;
var errors = new Generator(common, 'zh-CN').errors;

var assert = require('assert');
var vig = require('../lib');
var request = require('supertest');
var express = require('express');
var nomethodHandlers = require('./nomethodHandlers');
var app;

describe('vig #nomethod', function () {
  before(function () {
    app = express();
    vig.normalize(app);
    vig.init(app, errors);
    vig.addHandlers(app, nomethodHandlers);
  });
  it('should get /nomethod/:id', function (done) {
    request(app)
      .post('/nomethod/100')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'nomethod100');
        done();
      });
  });

  it('should post /nomethod/:id', function (done) {
    request(app)
      .post('/nomethod/100')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'nomethod100');
        done();
      });
  });

  it('should get /nomethod/hello/:id', function (done) {
    request(app)
      .get('/nomethod/hello/100')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'nomethod100');
        done();
      });
  });

  it('should post /nomethod/hello/:id', function (done) {
    request(app)
      .post('/nomethod/hello/100')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'nomethod100');
        done();
      });
  });
});
