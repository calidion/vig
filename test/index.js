'use strict';

var assert = require('assert');
var vig = require('../lib');
var request = require('supertest');
var express = require('express');
var routersHandler = require('./routersHandler');
var policiesHandler = require('./policiesHandler');
var app;

describe('vig #routers', function () {
  before(function () {
    app = express();
    vig.init(app);
    vig.addHandlers(app, routersHandler);
    vig.addHandlers(app, policiesHandler);
  });
  it('should get /', function (done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'get');
        done();
      });
  });

  it('should post /', function (done) {
    request(app)
      .post('/')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'post');
        done();
      });
  });

  it('should get /index', function (done) {
    request(app)
      .get('/index')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'get');
        done();
      });
  });

  it('should post /index', function (done) {
    request(app)
      .post('/index')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'post');
        done();
      });
  });

  it('should post /be/ok', function (done) {
    request(app)
      .post('/be/ok')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'post');
        done();
      });
  });
});

describe('VService', function () {
  var path = require('path');
  var componentPath = path.resolve(__dirname, './component/');

  var handler = new vig.VHandler(
    ['/url'],
    componentPath,
    '/prefix'
  );
  var service = new vig.VService();
  service.addHandler(handler);
  before(function () {
    app = express();
    vig.init(app);
    vig.addHandlers(app, service.toHandlers());
  });

  it('should get ', function (done) {
    request(app)
      .get('/prefix/url')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'get');
        done();
      });
  });
});
