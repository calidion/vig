import 'mocha';
import { VValidator } from '../../src/Components/VValidator';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

var componentPath = path.resolve(__dirname, '../../../test/component/');
var objPath = path.resolve(__dirname, '../../../test/component/validators');
const config = new VValidator();

describe('VValidator', () => {
  it('should new VValidator', () => {
    assert(config);
  });

  it('should load', () => {
    var data: any = config.load(objPath);
    assert(data && data.test && data.test.a === '1');
  })

  it('should load', () => {
    var route = new VValidator(componentPath);
    var data: any = route.load();
    assert(data && data.test && data.test.a === '1');
  })
});