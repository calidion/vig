var assert = require('assert');
var request = require('supertest');
var express = require('express');
var path = require('path');
import { VHandler, VService, VEvent } from '../src';
var app = express();

describe('vig #configs', function () {
  before(function () {
    var handler = new VHandler();
    handler.set({
      urls: ['/configs'],
      configs: {
        limitation: {
          page: 100
        }
      },
      asyncs: {
        get: async (req, res, scope) => {
          scope.asyncs = {
            parsed: true
          };
        }
      },
      routers: {
        get: async (req, res, scope) => {
          const { configs, asyncs } = scope;
          assert(configs.limitation.page === 100);
          assert(asyncs.parsed);
          res.send('get');
        },
        post: async (req, res, scope) => {
          const { configs, asyncs } = scope;
          assert(configs.limitation.page === 100);
          assert(!asyncs);
          res.send('post');
        }
      }
    });
    handler.attach(app);
  });
  it('should get configs', function (done) {
    request(app)
      .get('/configs')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'get');
        done();
      });
  });

  it('should post configs', function (done) {
    request(app)
      .post('/configs')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'post');
        done();
      });
  });
});
