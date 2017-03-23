import 'mocha';
import { VMiddleware } from '../../src/Components/VMiddleware';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

const router = new VMiddleware();
var componentPath = path.resolve(__dirname, '../../../tstest/component/');
var objPath = path.resolve(__dirname, '../../../tstest/component/conditions');

describe('VMiddleware', () => {
  it('should new VMiddleware', () => {
    assert(router);
  });

  it('should load', () => {
    var data: any = router.load(objPath);
    assert(data && data.get && data.post);
  })

  it('should load', () => {
    var router = new VMiddleware(componentPath);
    var data: any = router.load();
    assert(data && data.get && data.post && !data.fuck);
  })
});