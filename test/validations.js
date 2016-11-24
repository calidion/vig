'use strict';
var common = require('errorable-common');
var errorable = require('errorable');
var Generator = errorable.Generator;
var errors = new Generator(common, 'zh-CN').errors;

var assert = require('assert');
var vig = require('../lib');
var request = require('supertest');
var express = require('express');
var validationsHandlers = require('./validationsHandlers');
var app;

describe('vig #validations', function () {
  before(function () {
    app = express();
    vig.normalize(app);
    vig.init(app, errors);
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
        assert(res.text === 'Access Denied Due to Failure to conditions');
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
  it('should post /validations/2', function (done) {
    request(app)
      .post('/validations/2')
      .send({
        did: 'df'
      })
      .expect(403)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'Access Denied Due to Failure to validations');
        done();
      });
  });

  it('should post /validations/2', function (done) {
    request(app)
      .post('/validations/2')
      .send({
        value: '100'
      })
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert.deepEqual(JSON.parse(res.text),
          {
            value: 100
          });
        done();
      });
  });

  it('should post /validations/2 with query', function (done) {
    request(app)
      .post('/validations/2?username=sdfsf&c=3')
      .expect(403)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'Access Denied Due to Failure to validations');
        done();
      });
  });

  it('should post /validations/2 with query', function (done) {
    request(app)
      .post('/validations/2?username=sdfsf&password=32323123')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert.deepEqual(JSON.parse(res.text),
          {
            username: 'sdfsf',
            password: '32323123'
          });
        done();
      });
  });

  it('should post /validate/100', function (done) {
    request(app)
      .post('/validate/100')
      .expect(404)
      .end(function (err, res) {
        assert(!err);
        assert(res.text);
        done();
      });
  });

  it('should post /params/:id', function (done) {
    request(app)
      .post('/params/100')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'post');
        done();
      });
  });

  it('should post /params/:id', function (done) {
    request(app)
      .post('/params/abcd')
      .expect(403)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'Access Denied!');
        done();
      });
  });
});
