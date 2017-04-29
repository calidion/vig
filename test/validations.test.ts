'use strict';
var common = require('errorable-common');
var errorable = require('errorable');
var Generator = errorable.Generator;
var errors = new Generator(common, 'zh-CN').errors;

var assert = require('assert');
var request = require('supertest');
var express = require('express');

var path = require('path');
import { VHandler, VService } from '../src';
var service = new VService();
var app = express();
service.attach(app);
service.include(app, path.resolve(__dirname, './data/validationsHandlers'));

describe('vig #validations', function () {
  it('should get /validations', function (done) {
    request(app)
      .get('/validations')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'get');
        done();
      });
  });
  it('should post /validations', function (done) {
    request(app)
      .post('/validations')
      .expect(403)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'Access Denied!');
        done();
      });
  });

  it('should post /validations/2 1', function (done) {
    request(app)
      .get('/validations/2')
      .expect(403)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'Access Denied Due to Failure to conditions');
        done();
      });
  });
  it('should post /validations/2 2', function (done) {
    request(app)
      .post('/validations/2')
      .expect(403)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'Access Denied Due to Failure to validations');
        done();
      });
  });
  it('should post /validations/2 3', function (done) {
    request(app)
      .post('/validations/2')
      .send({
        did: 'df'
      })
      .expect(403)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'Access Denied Due to Failure to validations');
        done();
      });
  });

  it('should post /validations/2 4', function (done) {
    request(app)
      .post('/validations/2')
      .send({
        value: '100'
      })
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert.deepEqual(JSON.parse(res.text),
          {
            body: {
              value: 100
            }
          });
        done();
      });
  });

  it('should post /validations/2 with query', function (done) {
    request(app)
      .post('/validations/2?username=sdfsf&c=3')
      .expect(403)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'Access Denied Due to Failure to validations');
        done();
      });
  });

  it('should post /validations/2 with query', function (done) {
    request(app)
      .post('/validations/2?username=sdfsf&password=32323123')
      .expect(200)
      .send({
        value: 100
      })
      .end(function (err, res) {
        assert(!err);
        assert.deepEqual(JSON.parse(res.text),
          {
            query: {
              username: 'sdfsf',
              password: '32323123'
            },
            body: {
              value: 100
            }
          });
        done();
      });
  });

  it('should post /validate/100', function (done) {
    request(app)
      .post('/validate/100')
      .expect(404)
      .end(function (err, res) {
        assert(!err);
        assert(res.text);
        done();
      });
  });

  it('should post /params/:id', function (done) {
    request(app)
      .post('/params/100')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'post');
        done();
      });
  });

  it('should post /params/:id', function (done) {
    request(app)
      .post('/params/abcd')
      .expect(403)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'Access Denied!');
        done();
      });
  });
  it('should post /post/:id', function (done) {
    request(app)
      .post('/post/abcd')
      .expect(403)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'Access Denied!');
        done();
      });
  });
  it('should post /unded/:id', function (done) {
    request(app)
      .post('/unded/abcd')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'post');
        done();
      });
  });
  it('should post /nag/:id', function (done) {
    request(app)
      .post('/nag/abcd')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'post');
        done();
      });
  });
});
