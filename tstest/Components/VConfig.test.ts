import 'mocha';
import { VConfig } from '../../src/Components/VConfig';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

const config = new VConfig();
var componentPath = path.resolve(__dirname, '../../../test/config');

describe('VConfig', () => {
  it('should new VConfig', () => {
    assert(config);
  });

  it('should load', () => {
    var data: any = config.load(componentPath);
    console.log(data);
    assert(data && data.test && data.test.a === '1');
  })
});