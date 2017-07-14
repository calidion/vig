import 'mocha';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

import * as express from 'express';
import * as request from 'supertest';
import * as common from 'errorable-common';

import * as errorize from 'errorable-express';
import { VHandler, VService, VError } from '../../src/';
var service = new VService();
var app = express();

let errorsHandlers = require('../data/errorsHandlers');

const error = new VError();

var errors;

describe('VError', () => {

  before(function () {
    app = express();
    var file = path.resolve(__dirname, '../data/errors/vig.js');
    error.set(common);
    error.addFile(file);
    errors = error.generate(null, true);
    app.use(errorize(errors));
    service.attach(app);
    service.addHandlers(app, errorsHandlers);
  });

  it('should get /errors', function (done) {
    request(app)
      .get('/errors')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert.deepEqual(res.body, errors.Success.restify());
        done();
      });
  });

  it('should put /errors', function (done) {
    request(app)
      .put('/errors')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert.deepEqual(res.body, errors.VigTestError.restify());
        done();
      });
  });

  it('should new VError', () => {
    assert(error);
  });

  it('should generate errors', () => {
    assert(errors && errors.VigTestError);
  })

  it('should load', () => {
    var error = new VError(path.resolve(__dirname, '../data/'));
    var data: any = error.load();
    assert(data);
    var errors: any = error.generate();
    assert(errors && errors.VigTestError);
    errors = error.generate('', false);
    assert(errors && errors.VigTestError);
    error.filter();
    error.addDir(path.resolve(__dirname, '../data/'));
  })

  it('should merge', () => {
    var error = new VError(path.resolve(__dirname, '../data/'));
    var data: any = error.merge({
      Send: {
        Me: {
          messages: {
            'zh-CN': 'Vig测试错误!',
            'en-US': 'Vig Test Error!'
          }
        }
      }
    });
    var errors: any = error.generate('', false);
    assert(errors && errors.SendMe);
  })

  it('should merge errors', (done) => {
    var error = new VError(path.resolve(__dirname, '../data/'));
    var data: any = error.merge({
      Send: {
        Me: {
          messages: {
            'zh-CN': 'Vig测试错误!',
            'en-US': 'Vig Test Error!'
          }
        }
      }
    });

    error.attach(app);

    var errors: any = error.generate('', false);

    app.all('/merged/errors', function (req, res) {
      res.errorize(res.errors.SendMe);
    });

    request(app)
      .get('/merged/errors')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert.deepEqual(res.body, errors.SendMe.restify());
        done();
      });
  })

});