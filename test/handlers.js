'use strict';
var express = require('express');
var path = require('path');
var assert = require('assert');

var vig = require('../lib');
var Handler = require('../lib/handlers');
var app;
var request = require('supertest');

describe('vig #handlers', function () {
  before(function () {
    app = express();
    vig.normalize(app);
    vig.init(app);
  });
  it('should init a handle', function () {
    var handler = new Handler(vig, app);
    handler.add();
  });

  it('should include handles', function () {
    vig.include(path.resolve(__filename), ['nomethodHandlers', 'nourlsHandlers']);
    vig.enable(app);
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
