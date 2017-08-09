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
var app = express();

describe('vig #prefix', function () {
  before(function () {
    var handlers = require(path.resolve(__dirname, './data/prefixHandlers'));
    for (var i = 0; i < handlers.length; i++) {
      var handler = new VHandler();
      handler.set(handlers[i]);
      handler.attach(app);
    }
  });
  it('should get /prefix/:id', function (done) {
    request(app)
      .post('/prefix/100')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'prefix100');
        done();
      });
  });
});
