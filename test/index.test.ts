'use strict';

var assert = require('assert');
var request = require('supertest');
var express = require('express');

var path = require('path');
import { VHandler, VService } from '../src';
var service = new VService();
var app = express();

describe('vig #routers', function () {
  before(function () {
    service.include(app, path.resolve(__dirname, './data/routersHandler'));
    service.include(app, path.resolve(__dirname, './data/policiesHandler'));
  });
  it('should get /', function (done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'get');
        done();
      });
  });

  it('should post /', function (done) {
    request(app)
      .post('/')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'post');
        done();
      });
  });

  it('should get /index', function (done) {
    request(app)
      .get('/index')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'get');
        done();
      });
  });

  it('should post /index', function (done) {
    request(app)
      .post('/index')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'post');
        done();
      });
  });

  it('should post /be/ok', function (done) {
    request(app)
      .post('/be/ok')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'post');
        done();
      });
  });
});
