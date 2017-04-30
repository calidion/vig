import 'mocha';
import { VHandler } from '../src';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
// import * as vig from '../lib/';

import * as express from 'express';

const app = express();
import * as request from 'supertest';

var componentPath = path.resolve(__dirname, './data/component/');

var componentPathNoFailure = path.resolve(__dirname, './data/component.nofailure/');

describe('VHandler', () => {
  it('should new VHandler', () => {
    const handler = new VHandler(null, __dirname);
    var json = handler.toJSON();
    assert(json);
  });

  it('should new VHandler', () => {
    var passed = false;
    const handler = new VHandler(['/abc'], null);
    var json = handler.toJSON();
    assert(json);
  });

  it('should new VHandler', () => {
    const handler = new VHandler(['/abc'], 'null');
    var json = handler.toJSON();
    assert(json);
  });

  it('should new VHandler', (done) => {
    const handler = new VHandler(
      [
        '/xxx'
      ],
      componentPath,
      '/send');
    var json = handler.toJSON();
    assert(json);
    handler.attach(app);
    request(app).get('/send/xxx').
      expect(200, function (err, res) {
        assert(res.text === 'get');
        done()
      });
  });

  it('should new VHandler', (done) => {
    const handler = new VHandler(
      [
        '/xxx'
      ],
      componentPath,
      '/send');
    var json = handler.toJSON();
    assert(json);
    handler.attach(app);
    request(app).put('/send/xxx').
      expect(404, function (err, res) {
        assert(!err);
        assert(res.text === 'Not Found!');
        done()
      });
  });

  it('should new VHandler', (done) => {
    let visited = false;
    let handler = new VHandler(
      [
        '/xxx'
      ],
      componentPath,
      '/send');
    handler.setUrls(['/send/xxx111'])
    handler.setPrefix('/prefix');
    handler.update('rouaaater', {
    });
    handler.update('router', {
      put: function (req, res) {
        visited = true;
        res.send('put');
      }
    });
    handler.attach(app);
    request(app).put('/prefix/send/xxx111').
      end(function (err, res) {
        assert(!err);
        assert(visited);
        assert(res.text === 'put');
        done()
      });
  });

  it('should extend VHandler', (done) => {
    let visited = false;
    let handler = new VHandler();
    handler.setUrls(['/send/xxx222'])
    handler.setPrefix('/prefix');
    handler.extend('sooo', () => {
    });
    handler.extend('post', null);
    handler.extend('post', null);
    handler.extend('get', function (req, res) {
      visited = true;
      res.send('get');
    });
    handler.attach(app);
    request(app).get('/prefix/send/xxx222').
      end(function (err, res) {
        assert(!err);
        assert(visited);
        assert(res.text === 'get');
        done()
      });
  });

  it('should extend VHandler after attach', (done) => {
    let visited = false;
    let visited1 = false;
    let handler = new VHandler();
    handler.setUrls(['/send/resend'])
    handler.setPrefix('/prefix');
    handler.extend('sooo', () => {
    });
    handler.extend('post', null);
    handler.extend('post', null);
    handler.extend('get', function (req, res) {
      visited = true;
      res.send('get');
    });
    handler.attach(app);
    handler.extend('get', function (req, res) {
      visited1 = true;
      res.send('get1');
    });
    request(app).get('/prefix/send/resend').
      end(function (err, res) {
        assert(!err);
        assert(visited1);
        assert(res.text === 'get1');
        done()
      });
  });

  it('should extend VHandler after attach', () => {
    let visited = false;
    let visited1 = false;
    let handler = new VHandler();
    handler.urls = null;
    handler.attach(app);
  });
});