import 'mocha';
import { VFallback } from '../../src/MiddlewareParsers/VFallback';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

const router = new VFallback();
var componentPath = path.resolve(__dirname, '../data/component');
var objPath = path.resolve(__dirname, '../data/component/fallbacks');

describe('VFallback', () => {
  it('should new VFallback', () => {
    assert(router);
  });

  it('should load', () => {
    var data: any = router.load(objPath);
    assert(data && data.condition
     && data.validation
     && data.policy);
  })

  it('should load', () => {
    var router = new VFallback(componentPath);
    var data: any = router.load();
    assert(data && data.condition
     && data.validation
     && data.policy);
      })
});