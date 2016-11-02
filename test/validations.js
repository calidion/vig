'use strict';
var assert = require('assert');
var vig = require('../lib');
var request = require('supertest');
var express = require('express');
var validationsHandlers = require('./validationsHandlers');
var app;

describe('vig #validations', function () {
  before(function () {
    app = express();
    vig.init(app);
    vig.addHandlers(app, validationsHandlers);
  });
  it('should get /validations', function (done) {
    request(app)
      .get('/validations')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'get');
        done();
      });
  });
  it('should post /validations', function (done) {
    request(app)
      .post('/validations')
      .expect(403)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'Access Denied!');
        done();
      });
  });

  it('should post /validations/2', function (done) {
    request(app)
      .get('/validations/2')
      .expect(403)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'Access Denied!');
        done();
      });
  });
  it('should post /validations/2', function (done) {
    request(app)
      .post('/validations/2')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'post');
        done();
      });
  });

  it('should post /validations/3', function (done) {
    request(app)
      .post('/validations/3')
      .expect(404)
      .end(function (err, res) {
        assert(!err);
        assert(res.text);
        done();
      });
  });
});

