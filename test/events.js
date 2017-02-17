'use strict';

var assert = require('assert');
var vig = require('../lib');
var eventsHandlers = require('./eventsHandlers');
vig.events.add(eventsHandlers);

describe('vig #events', function () {
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
    var passed = false;
    vig.events.on('hello', function (data) {
      assert(data === 'world');
      if (passed === false) {
        passed = true;
        vig.events.send('hello', 'world');
      } else {
        done();
      }
    });
    vig.events.send('hello', 'world');
  });

  it('should enable once events', function (done) {
    var res;
    vig.events.once('hello1', function (data) {
      assert(data === 'world');
      let res = vig.events.send('hello1', 'world');
      assert(!res);
      done();
    });
    res = vig.events.send('hello1', 'world');
    assert(res);
  });
});

