'use strict';
var path = require('path');
var errors;

var assert = require('assert');
var vig = require('../lib');
var request = require('supertest');
var express = require('express');
var errorsHandlers = require('./errorsHandlers');
var app;

describe('vig #errors', function () {
  before(function () {
    app = express();
    var generator = new vig.Errors();
    generator.add(path.join(__dirname, '/errorsHandlers'));
    generator.add(path.join(__dirname, '/errors/vig.js'));
    generator.add(path.join(__dirname, '/aaa.js'));
    errors = generator.generate();
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

  it('should put vig /errors', function (done) {
    request(app)
      .put('/errors')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert.deepEqual(res.body, errors.VigTestError.restify());
        done();
      });
  });
});

