'use strict';
var express = require('express');
var path = require('path');
var assert = require('assert');

import { VHandler, VService } from '../src';
var service = new VService();
var app = express();
var request = require('supertest');


describe('vig #handlers', function () {
  it('should include handles', function () {
    service.include(app, path.resolve(__dirname, './data/nomethodHandlers'));
    service.include(app, path.resolve(__dirname, './data/nourlsHandlers'));
  });

  it('should get /nomethod/:id', function (done) {
    request(app)
      .post('/nomethod/100')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === 'nomethod100');
        done();
      });
  });
});
