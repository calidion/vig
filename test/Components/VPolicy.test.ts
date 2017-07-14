import 'mocha';
import { VPolicy } from '../../src/MiddlewareParsers/VPolicy';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

const router = new VPolicy();
var componentPath = path.resolve(__dirname, '../data/component/');
var objPath = path.resolve(__dirname, '../data/component/policies');

describe('VPolicy', () => {
  it('should new VPolicy', () => {
    assert(router);
  });

  it('should load', () => {
    var data: any = router.load(objPath);
    assert(data && data.get && data.post);
  })

  it('should load', () => {
    var router = new VPolicy(componentPath);
    var data: any = router.load();
    assert(data && data.get && data.post && !data.fuck);
  })
});