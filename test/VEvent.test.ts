import 'mocha';
import { VEvent } from '../src';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

const config = require('./data/fixtures/events');

const event = new VEvent();
event.add(config);

const once = require('./data/fixtures/events.once');

event.add(once, false);

describe('VEvent', () => {
  it('should new VEvent', () => {
    const event = new VEvent();
    assert(event);
  });

  it('should handle /events', function (done) {
    event.send('@event1', function (data) {
      assert(data === '@event1');
      done();
    });
  });

  it('should handle /events again', function (done) {
    var visited = false;
    event.send('@event1', function (data) {
      visited = true;
    });
    setTimeout(() => {
      assert(!visited);
      done();
    }, 30);
  });

  it('should handle event', function (done) {
    event.send('@eventonce1', function (data) {
      assert(data === '@eventonce1');
      done();
    });
  });

  it('should handle event again', function (done) {
    event.send('@eventonce1', function (data) {
      assert(data === '@eventonce1');
      done();
    });
  });

  it('should get /events', function (done) {
    event.send('@event2', function (data) {
      assert(data === '@event2');
      done();
    });
  });

  it('should enable on events', function (done) {
    var passed = false;
    event.on('hello', function (data) {
      assert(data === 'world');
      if (passed === false) {
        passed = true;
        event.send('hello', 'world');
      } else {
        done();
      }
    });
    event.send('hello', 'world');
  });

  it('should enable once events', function (done) {
    var res;
    event.once('hello1', function (data) {
      assert(data === 'world');
      var res1 = event.send('hello1', 'world');
      assert(!res1);
      done();
    });
    res = event.send('hello1', 'world');
    assert(res);
  });
});