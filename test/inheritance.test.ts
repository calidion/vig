import 'mocha';
import { VHandler } from '../src';

import * as express from 'express';
import * as request from 'supertest';
import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';


const app = express();

describe('Inheritance', () => {
  it("should init", function () {
    var componentPathUrls = path.resolve(__dirname, './data/component.inheritance/');
    const handler = new VHandler(null, componentPathUrls);
    handler.attach(app);
  });

  it('should get configs', function (done) {
    request(app).get('/configs')
      .end(function (err, res) {
        console.log(err, res.text);
        assert(!err);

        assert(res.text === '{"upload":{"file":1},"third":{"third":true}}');
        done();
      });
  });

  it('should get one', function (done) {
    request(app).get('/one')
      .end(function (err, res) {
        console.log(err, res.text);
        assert(!err);

        assert(res.text === '{"upload":{"file":1},"one":{"one":true}}');
        done();
      });
  });
});