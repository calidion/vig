'use strict';

var assert = require('assert');
var vig = require('../lib');
var request = require('supertest');
var express = require('express');
var policiesController = require('./policiesController');
var session = require('express-session');
var cookies;
var app = express();
app.set('trust proxy', 1); // trust first proxy

app.use(session({
  name: 'vig',
  secret: 'secret oososos',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}));
app.use(vig.policies.use);

vig.addController(app, policiesController);

describe('vig', function () {
  it('should get prevent all', function (done) {
    request(app)
      .get('/prevent/all')
      .expect(403)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'Access Denied!');
        done();
      });
  });

  it('should post /prevent all', function (done) {
    request(app)
      .post('/prevent/all')
      .expect(403)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'Access Denied!');
        done();
      });
  });

  it('should get allow all', function (done) {
    request(app)
      .get('/allow/all')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'get');
        done();
      });
  });
  it('should post allow all', function (done) {
    request(app)
      .post('/allow/all')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'post');
        done();
      });
  });

  it('should logout', function (done) {
    request(app)
      .get('/user/logout')
      .expect(200)
      .end(function (err, res) {
        cookies = res.headers['set-cookie'].pop().split(';')[0];
        assert(!err);
        assert(res.text === 'logout');
        done();
      });
  });

  it('should fail to profile', function (done) {
    var req = request(app).get('/user/profile');
    req.cookies = cookies;
    req
      .expect(403)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'Access Denied!');
        done();
      });
  });
  it('should login', function (done) {
    var req = request(app).get('/user/login');
    req.cookies = cookies;
    req
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'login');
        done();
      });
  });
  it('should profile', function (done) {
    var req = request(app).get('/user/profile');
    req.cookies = cookies;
    req
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'profile');
        done();
      });
  });
  it('should logout', function (done) {
    var req = request(app).get('/user/logout');
    req.cookies = cookies;
    req
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'logout');
        done();
      });
  });
  it('should fail to profile again', function (done) {
    var req = request(app).get('/user/profile');
    req.cookies = cookies;
    req
      .expect(403)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'Access Denied!');
        done();
      });
  });
});
