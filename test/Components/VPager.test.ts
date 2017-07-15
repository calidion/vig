import 'mocha';
import { VPager } from '../../src/MiddlewareParsers/VPager';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

const pager = new VPager("");
var componentPath = path.resolve(__dirname, '../data/component/');
var objPath = path.resolve(__dirname, '../data/component/pagers');

describe('VPolicy', () => {
  it('should new VPolicy', () => {
    assert(pager);
  });

  it('should load', () => {
    var data: any = pager.load(objPath);
    assert(data && data.get && !data.post);
  })

  it('should load', () => {
    var pager1 = new VPager(componentPath);
    var data: any = pager1.load();
    assert(data && data.get && !data.post && !data.fuck);
  })
});