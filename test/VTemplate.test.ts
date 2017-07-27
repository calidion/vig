import 'mocha';
import { VHandler, VRouter } from '../src';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
// import * as vig from '../lib/';

import * as express from 'express';

const app = express();
import * as request from 'supertest';

var componentPathUrls = path.resolve(__dirname, './data/component.templates/');
let handler = new VHandler(null, componentPathUrls);
handler.attach(app);
describe('VTemplate', () => {
  it('should invoke hirarchically', (done) => {
    request(app).get('/h2').
      expect(200, function (err, res) {
        assert(!err);
        console.log(err, res.text);
        assert(res.text.indexOf("color: black;") !== -1);
        assert(res.text.indexOf("Hello, VIG, Good Morning") !== -1);
        done();
      });
  });

  it('should invoke hirarchically again', (done) => {
    assert(handler.template.isType(""));
    request(app).get('/h2').
      expect(200, function (err, res) {
        assert(!err);
        assert(res.text.indexOf("color: black;") !== -1);
        assert(res.text.indexOf("Hello, VIG, Good Morning") !== -1);
        done();
      });
  });

  it('should request arrayed middlewares', (done) => {
    assert(handler.template.isType(""));
    request(app).get('/h1').
      expect(200, function (err, res) {
        assert(!err);
        assert(res.text === "get");
        done();
      });
  });

  it('should request arrayed middlewares with failure', (done) => {
    assert(handler.template.isType(""));
    request(app).post('/h1').
      expect(403, function (err, res) {
        console.log(err, res.text);
        assert(!err);
        assert(res.text === "Access Denied!");
        done();
      });
  });
});