'use strict';
var common = require('errorable-common');
var errorable = require('errorable');
var Generator = errorable.Generator;
var errors = new Generator(common, 'zh-CN').errors;

var assert = require('assert');
var request = require('supertest');
var express = require('express');
var path = require('path');
var componentPath = path.resolve(__dirname, './data/component.middleware/');
var componentPath1 = path.resolve(__dirname, './data/component.middleware.all/');
import { VEvent, VService, VHandler } from '../src';

var app;

describe('#middlewares', function () {
  before(function () {
    app = express();
  });
  it('should get /middlewares', function (done) {
    var handler = new VHandler(
      ['/'],
      componentPath,
      '/middlewares'
    );
    handler.attach(app);

    request(app)
      .get('/middlewares')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'mid');
        done();
      });
  });
  it('should get /middlewares', function (done) {
    var handler = new VHandler(
      ['/all'],
      componentPath1,
      '/middlewares'
    );
    handler.attach(app);
    request(app)
      .get('/middlewares/all')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'all');
        done();
      });
  });

  // it('should send event', function (done) {
  //   const event = new VEvent();
  //   event.send("send");
  //   event.send("hello", (data, errors) => {
  //     assert(data === "hello");
  //     assert(errors);
  //     assert(errors.VigTestError);
  //     done();
  //   });
  // });

  // it('should send event', function (done) {
  //   const event = new VEvent();
  //   event.send("send");
  //   setTimeout(() => {
  //     done();
  //   }, 100);
  // });

  it('should send middlewares return false', function (done) {
    const handler = new VHandler();
    handler.set({
      urls: ["/mid4"],
      middlewares: {
        get: async (req, res, scope) => {
          res.send("middleware");
          return false;
        },
        post: [async (req, res, scope) => {
          scope.body = "middle";
        }, async (req, res, scope) => {
          res.send("middleware2");
          return false;
        }, async (req, res, scope) => {
          res.send("middleware3");
        }]
      },
      routers: {
        get: async (req, res, scope) => {
          res.send("mid router");
        }
      }
    });

    handler.attach(app);
    request(app)
      .get('/mid4')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'middleware');
        done();
      });
  });

  it('should send middlewares return false', function (done) {
    request(app)
      .post('/mid4')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'middleware2');
        done();
      });
  });
});
