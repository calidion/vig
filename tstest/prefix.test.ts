'use strict';
var common = require('errorable-common');
var errorable = require('errorable');
var Generator = errorable.Generator;
var errors = new Generator(common, 'zh-CN').errors;

var assert = require('assert');
var request = require('supertest');
var express = require('express');
var path = require('path');
import { VHandler, VService } from '../../lib';
var service = new VService();
var app = express();

describe('vig #prefix', function () {
  before(function () {
    service.include(app, path.resolve(__dirname, '../../test/prefixHandlers'));
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
