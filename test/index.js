'use strict';

var assert = require('assert');
var vig = require('../lib');
var request = require('supertest');
var Express = require('express');
var controller = require('./controller');
var app = new Express();

vig.addController(app, controller);

describe('vig', function () {
  it('should get /', function (done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        console.log(res.text);
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
        console.log(res.text);
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
        console.log(res.text);
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
        console.log(res.text);
        assert(res.text === 'post');
        done();
      });
  });
});
