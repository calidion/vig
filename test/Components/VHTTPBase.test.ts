import 'mocha';
import { VHTTPBase } from '../../src/Components/VHTTPBase';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

const base = new VHTTPBase(__dirname);

class VHTTP extends VHTTPBase {
  constructor(path = "") {
    super(path);
    this.defaultPath = "a";
  }
  public isType(item: any): boolean {
    return item instanceof Function || typeof item === "string";
  }
}

const v = new VHTTP();

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

  it('should checkEx', () => {
    v.setFailureHandler('get');
    v.set({
      get: 'get'
    });
        v.checkEx({
      method: 'get'
    });
    v.checkEx({
      method: 'get',
      a: {
      }
    });
    v.checkEx({
      method: 'get',
      a: {
        get: 'sodff'
      }
    });
    new VHTTPBase("");
    new VHTTPBase("sosos");
  })
});