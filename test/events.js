'use strict';

var assert = require('assert');
var vig = require('../lib');
var express = require('express');
var eventsHandlers = require('./eventsHandlers');
var app;

describe('vig #events', function () {
  before(function () {
    app = express();
    vig.init(app);
    vig.addHandlers(app, eventsHandlers);
  });
  it('should handle /events', function (done) {
    vig.events.send('@event1', function (data) {
      assert(data === '@event1');
      done();
    });
  });
  it('should get /events', function (done) {
    vig.events.send('@event2', function (data) {
      assert(data === '@event2');
      done();
    });
  });

  it('should enable on events', function (done) {
    vig.events.on('hello', function (data) {
      assert(data === 'world');
      done();
    });
    vig.events.send('hello', 'world');
  });
});

