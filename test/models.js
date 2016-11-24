'use strict';
var assert = require('assert');

var vig = require('../lib');
var path = require('path');
var sailsMemoryAdapter = require('sails-memory');

describe('vig #models', function () {
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
});

