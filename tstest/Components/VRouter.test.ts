import 'mocha';
import { VRouter } from '../../src/Components/VRouter';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

const router = new VRouter();
var componentPath = path.resolve(__dirname, '../../../tstest/component');
var objPath = path.resolve(__dirname, '../../../tstest/component/routers');

describe('VRouter', () => {
  it('should new VRouter', () => {
    assert(router);
  });

  it('should load', () => {
    var data: any = router.load(objPath);
    assert(data && data.get && data.post);
  })

  it('should load', () => {
    var router = new VRouter(componentPath);
    var data: any = router.load();
    console.log(data);
    assert(data && data.get && data.post && !data.fuck);
    router.filter();
  })
});