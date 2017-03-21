import 'mocha';
import { VConfig } from '../../src/Components/VConfig';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

var componentPath = path.resolve(__dirname, '../../../test/');
var objPath = path.resolve(__dirname, '../../../test/configs');
const config = new VConfig();

describe('VConfig', () => {
  it('should new VConfig', () => {
    assert(config);
  });

  it('should load', () => {
    var data: any = config.load(objPath);
    assert(data && data.test && data.test.a === '1');
  })

  it('should load', () => {
    var route = new VConfig(componentPath);
    var data: any = route.load();
    assert(data && data.test && data.test.a === '1');
  })
});