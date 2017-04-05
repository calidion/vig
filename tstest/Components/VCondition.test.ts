import 'mocha';
import { VCondition } from '../../../lib/Components/VCondition';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

const router = new VCondition();
var componentPath = path.resolve(__dirname, '../../../tstest/component/');
var objPath = path.resolve(__dirname, '../../../tstest/component/conditions');

describe('VCondition', () => {
  it('should new VCondition', () => {
    assert(router);
  });

  it('should load', () => {
    var data: any = router.load(objPath);
    assert(data && data.get && data.post);
  })

  it('should load', () => {
    var router = new VCondition(componentPath);
    var data: any = router.load();
    assert(data && data.get && data.post && !data.fuck);
  })
});