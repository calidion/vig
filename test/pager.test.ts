'use strict';
var common = require('errorable-common');
var errorable = require('errorable');
var Generator = errorable.Generator;
var errors = new Generator(common, 'zh-CN').errors;

var assert = require('assert');
var request = require('supertest');
var express = require('express');
var path = require('path');
import { VHandler, VService } from '../src';
var app = express();

describe('vig #pager', function () {
  before(function () {
    var handler = new VHandler();
    handler.set({
      urls: ['/pager'],
      pagers: {
        get: true,
        post: false
      },
      routers: {
        get: async (req, res, scope) => {
          const { query } = scope;
          assert(query.page);
          assert(query.limit);
          res.send('get');
        },
        post: async (req, res, scope) => {
          const { query } = scope;
          assert(!query.page);
          assert(!query.limit);
          res.send('post');
        }
      }
    });
    handler.attach(app);
  });
  it('should get pager', function (done) {
    request(app)
      .get('/pager')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'get');
        done();
      });
  });

  it('should get pager', function (done) {
    request(app)
      .get('/pager?page=0')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'get');
        done();
      });
  });

  it('should post pager', function (done) {
    request(app)
      .post('/pager')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'post');
        done();
      });
  });
});
