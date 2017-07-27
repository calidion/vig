'use strict';

var assert = require('assert');
var request = require('supertest');
var express = require('express');
var session = require('express-session');
var cookies;

var path = require('path');
import { VHandler, VService, VPolicy, VPolicyDefinition } from '../src';
var service = new VService();
var app = express();

// var policy = new VPolicyDefinition();
// policy = new VPolicyDefinition(path.resolve(__dirname, './data/'));

describe('vig #policies', function () {
  before(function () {
    app.use(session({
      name: 'vig',
      secret: 'secret oososos',
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false
      }
    }));
    service.include(app, path.resolve(__dirname, './data/policiesHandler'));
  });
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
      // .expect(403)
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

  it('should get policies', function (done) {
    var handler = new VHandler();
    handler.set({
      urls: ['/policies/text'],
      definitions: {
        policies: {
          ok: async (req, res, scope) => {
            res.status(200).send('ok');
          },
          test: async (req, res, scope) => {
            res.status(404).send('test');
          }
        }
      },
      routers: {
        get: function (req, res) {
          res.send('get');
        },
        post: function (req, res) {
          res.send('post');
        }
      },
      policies: {
        get: 'ok',
        post: 'test'
      }
    });
    handler.attach(app);
    var req = request(app).get('/policies/text');
    req
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'ok');
        done();
      });
  });

  it('should get policies', function (done) {
    var req = request(app).post('/policies/text');
    req
      .expect(404)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'test');
        done();
      });
  });

  it('should get policies', function (done) {
    var handler = new VHandler(
      ['/policies/text1'],
      path.resolve(__dirname, './data/component.policies')
    );
    let json = handler.toJSON();
    handler.attach(app);
    var req = request(app).get('/policies/text1');
    req
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'ok');
        done();
      });
  });

  it('should get policies', function (done) {
    var handler = new VHandler(
      ['/policies/put'],
      path.resolve(__dirname, './data/component.policies')
    );
    let json = handler.toJSON();
    handler.attach(app);
    var req = request(app).put('/policies/put');
    req
      .expect(403)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'Fail back!');
        done();
      });
  });
});
