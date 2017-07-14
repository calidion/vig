import 'mocha';
import { VValidator } from '../../src/MiddlewareParsers/VValidator';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

var componentPath = path.resolve(__dirname, '../data/component/');
var objPath = path.resolve(__dirname, '../data/component/validators');
const config = new VValidator();

describe('VValidator', () => {
  it('should new VValidator', () => {
    assert(config);
  });

  it('should load', () => {
    var data: any = config.load(objPath);
    assert(data && data.get && data.post && data.put);
  })

  it('should load', () => {
    var route = new VValidator(componentPath);
    var data: any = route.load();
    assert(data && data.get && data.post && data.put);
  })

  it('should addDir', () => {
    var route = new VValidator(componentPath);
    route.addDir(componentPath);
  })
});