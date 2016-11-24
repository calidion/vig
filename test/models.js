'use strict';
var assert = require('assert');

var vig = require('../lib');
var path = require('path');
var sailsMemoryAdapter = require('sails-memory');
var request = require('supertest');
var express = require('express');
var app;

describe('vig #models', function () {
  before(function () {
    app = express();
    vig.normalize(app);
    vig.init(app);
  });
  it('should init dir', function () {
    var dir = path.resolve(__dirname, './models/');
    vig.models.addDir(dir);
  });
  it('should init models', function (done) {
    vig.models.init({
      adapters: {
        memory: sailsMemoryAdapter
      },
      connections: {
        default: {
          adapter: 'memory'
        }
      }
    },
      {
        connection: 'default'
      },
      function (error, models) {
        assert(!error);
        assert(models);
        assert(models.User);
        assert(models.Pet);
        done();
      });
  });

  it('should init models again', function (done) {
    vig.models.init({
      adapters: {
        memory: sailsMemoryAdapter
      },
      connections: {
        default: {
          adapter: 'memory'
        }
      }
    },
      {
        connection: 'default'
      },
      function (error) {
        assert(error);
        done();
      });
  });
  it('should get test req.models', function (done) {
    app.use('/models/assert', function (req, res) {
      assert(req.models.Pet);
      assert(req.models.User);
      res.send('ok');
    });

    request(app)
      .post('/models/assert')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'ok');
        done();
      });
  });
});
