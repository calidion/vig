import 'mocha';

import { VHandler, VService } from '../src';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
import * as request from 'supertest';

var componentPath = path.resolve(__dirname, './data/component/');
var app;
var service = new VService();

var handler = new VHandler([
  '/url'
],
  componentPath,
  '/prefix');

describe('VService', () => {
  before(function () {
    app = express();
    service.attach(app);
    service.addHandler(app, handler);
  });
  it('should get ', function (done) {
    request(app)
      .get('/prefix/url')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'get');
        done();
      });
  });
});