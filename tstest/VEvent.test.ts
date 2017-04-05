import 'mocha';
import { VEvent } from '../../lib';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

const config = require('../../tstest/fixtures/events');

const event = new VEvent();
event.add(config);

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