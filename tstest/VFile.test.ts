import 'mocha';
import { VFile } from '../src';

import * as express from 'express';
import * as request from 'supertest';
import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

const file = new VFile();
var app;

describe('VFile', () => {
  before(function () {
    app = express();
    file.attach(app);
    app.post('/file/upload', function (req, res) {
      req.cloud('txt', {
        type: 'disk',
        config: {
          dir: path.resolve(__dirname, '../../test/uploaded/'),
          base: 'http://localhost'
        }
      }).then(function (files) {
        res.send(String(files.length));
      });
    });
  });

  it('should upload files', function (done) {
    request(app).post('/file/upload')
      .attach('txt', path.resolve(__dirname, '../../test/uploader/a.txt'))
      .attach('txt', path.resolve(__dirname, '../../test/uploader/b.txt'))
      .end(function (err, res) {
        assert(!err);
        assert(res.text === '2');
        done();
      });
  });
  it('should upload files', function (done) {
    request(app).post('/file/upload')
      .attach('txt', path.resolve(__dirname, '../../test/uploader/a.txt'))
      .end(function (err, res) {
        assert(!err);
        assert(res.text === '1');
        done();
      });
  });

  it('should test onError', function (done) {
    file._isError(true, function (err) {
      assert(err);
      done();
    });
  });
});