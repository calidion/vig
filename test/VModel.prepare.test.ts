import 'mocha';
import { VModel, VHandler } from '../src';
var assert = require('assert');
var path = require('path');
var sailsMemoryAdapter = require('sails-memory');
var request = require('supertest');
var express = require('express');
var app;

var componentPath = path.resolve(__dirname, './data/component.models/');

const model = new VModel(componentPath);

let models;

describe('VModel', function () {
  before(function () {
    app = express();
  });
  it('should init models', async () => {
    models = await VModel.fetch({
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
      });

    assert(models);
    assert(models.User);
    assert(models.Pet);
  });

  it('should get models again', async () => {
    models = await VModel.fetch({
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
      });

    assert(models);
    assert(models.User);
    assert(models.Pet);
  });

  it("should get models", (done) => {
    let app1 = express();
    let handler = new VHandler(['/models'], componentPath);
    handler.attach(app1);
    request(app1)
      .post('/models')
      .expect(200)
      .end(async (err, res) => {
        assert(!err);
        assert(res.text === 'post');
        done();
      });
  });
});
