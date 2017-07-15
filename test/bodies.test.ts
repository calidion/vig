'use strict';
var assert = require('assert');
var request = require('supertest');
var express = require('express');
var path = require('path');
import { VHandler, VService, VEvent } from '../src';
var app = express();

describe('vig #body', function () {
  it('should get body1', function (done) {
    var handler = new VHandler();
    handler.set({
      urls: ['/body1'],
      bodies: {
        post: {
          form: true
        }
      },
      routers: {
        post: async (req, res) => {
          console.log(req.body);
          res.send(req.body);
        }
      }
    });
    handler.attach(app);
    request(app)
      .post('/body1')
      .type('form')
      .send({
        key: 'value',
        key1: 'value1'
      })
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        console.log(res.body);
        assert(res.body.key === 'value');
        assert(res.body.key1 === 'value1');
        done();
      });
  });

  it('should get body2', function (done) {
    var handler = new VHandler();
    handler.set({
      urls: ['/body2'],
      bodies: {
        post: {
          formdata: true
        }
      },
      routers: {
        post: async (req, res) => {
          console.log(req.body);
          res.send(req.body);
        }
      }
    });
    handler.attach(app);
    request(app)
      .post('/body2')
      .type('form')
      .send({
        key: 'value',
        key1: 'value1'
      })
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        console.log(res.body);
        assert(res.body.key === 'value');
        assert(res.body.key1 === 'value1');
        done();
      });
  });

  it('should get body3', function (done) {
    var handler = new VHandler();
    handler.set({
      urls: ['/body3'],
      bodies: {
        post: {
          json: true
        }
      },
      routers: {
        post: async (req, res) => {
          console.log(req.body);
          res.send(req.body);
        }
      }
    });
    handler.attach(app);
    request(app)
      .post('/body3')
      .type('json')
      .send(JSON.stringify({
        key: 'value',
        key1: 'value1'
      }))
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        console.log(res.body);
        assert(res.body.key === 'value');
        assert(res.body.key1 === 'value1');
        done();
      });
  });

  it('should get body4', function (done) {
    var handler = new VHandler();
    handler.set({
      urls: ['/body4'],
      bodies: {
        post: {
          xml: true,
          lot: true,
          good: null,
          send: function (req, res, next) {
            next();
          }
        }
      },
      routers: {
        post: async (req, res) => {
          console.log(String(req.body));
          res.send(String(req.body));
        }
      }
    });
    handler.attach(app);
    request(app)
      .post('/body4')
      .type('raw')
      .set('Content-Type', 'text/xml')
      .set('Accept', 'text/xml')
      .send('<?xml version="1.0" encoding="utf-8" ?><key>value</key><key1>value1</key1>')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === '<?xml version="1.0" encoding="utf-8" ?><key>value</key><key1>value1</key1>');
        done();
      });
  });

    it('should get body5', function (done) {
    var handler = new VHandler();
    handler.set({
      urls: ['/body5'],
      bodies: {
        post: {
          xml: true,
          lot: true,
          good: null,
          send: function (req, res, next) {
            next();
          }
        }
      },
      routers: {
        post: async (req, res) => {
          console.log(String(req.body));
          res.send(String(req.body));
        }
      }
    });
    handler.attach(app);
    request(app)
      .post('/body5')
      .type('raw')
      .set('Content-Type', 'application/xml')
      .set('Accept', 'application/xml')
      .send('<?xml version="1.0" encoding="utf-8" ?><key>value</key><key1>value1</key1>')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === '<?xml version="1.0" encoding="utf-8" ?><key>value</key><key1>value1</key1>');
        done();
      });
  });
});
