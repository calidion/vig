import 'mocha';
import { VHTTPBase } from '../../../lib/Components/VHTTPBase';

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
});