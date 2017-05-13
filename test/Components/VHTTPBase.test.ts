import 'mocha';
import { VHTTPBase } from '../../src/Components/VHTTPBase';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

const base = new VHTTPBase(__dirname);

describe('VHTTPBase', () => {
  it('should new VHTTPBase', () => {
    assert(base);
  });
  it('should check', () => {
    base.set({
      get: true
    });
    assert(base.check({
      method: 'get'
    }));
    base.set({
      get: false
    });
    assert(!base.check({
      method: 'get'
    }));
  })

  it('should process', () => {
    base.set({
      get: true
    });
    assert(base.check({
      method: 'get'
    }));
    base.set({
      get: false
    });
    assert(!base.check({
      method: 'get'
    }));
  })

  it('should getFallback with no callbacks', () => {
    base.setFailureHandler('get');
    var handler = base.getFallback({
    });
    var handler1 = base.getFallback({
      fallbacks: {}
    });
    var handler2 = base.getFallback({
      fallbacks: { get: 'oosodssd' }
    });
  })
});