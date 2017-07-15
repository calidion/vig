'use strict';
var common = require('errorable-common');
var errorable = require('errorable');
var Generator = errorable.Generator;
var errors = new Generator(common, 'zh-CN').errors;

var assert = require('assert');
var request = require('supertest');
var express = require('express');
var path = require('path');
import { VHandler, VService, VEvent } from '../src';
var app = express();

describe('vig #pager', function () {
  before(function () {
    var handler = new VHandler();
    handler.set({
      urls: ['/errors'],
      errors: {
        I: {
          Love: {
            You: {
              messages: {
                'zh-CN': 'Vig测试错误!',
                'en-US': 'Vig Test Error!'
              }
            }
          }
        }
      },
      events: {
        hooee: null,
        send1: async (scope, cb) => {
          const { errors } = scope;
          assert(errors.ILoveYou);
          cb('send1');
        },
        send2: async (scope, cb) => {
          const { errors } = scope;
          assert(errors.ILoveYou);
          cb('send2');
        }
      },
      routers: {
        get: async (req, res, scope) => {
          const { errors } = scope;
          assert(errors.ILoveYou);
          res.send('get');
        },
        post: async (req, res, scope) => {
          const { errors } = scope;
          assert(errors.ILoveYou);
          res.send('post');
        }
      }
    });
    handler.attach(app);
  });
  it('should get errors', function (done) {
    request(app)
      .get('/errors')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'get');
        done();
      });
  });

  it('should post errors', function (done) {
    request(app)
      .post('/errors')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'post');
        done();
      });
  });

  it('should send events', function (done) {
    var event = new VEvent();
    event.send('send1', function (data) {
      assert(data === 'send1');
      done();
    });
  });

  it('should send events', function (done) {
    var event = new VEvent();
    event.send('send2', function (data) {
      assert(data === 'send2');
      done();
    });
  });
});
