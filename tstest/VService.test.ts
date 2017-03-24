import 'mocha';

import { VHandler, VService } from '../src';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
// import * as vig from '../lib/';

var componentPath = path.resolve(__dirname, '../../tstest/component/');

var handler = new VHandler([
  '/url'
],
  componentPath,
  '/prefix');

describe('VService', () => {
  it('should new VService', () => {
    console.log(handler.toJSON());
    const service = new VService();
    service.addHandler(handler);
    var json = service.toHandlers();
    console.log(json);
    assert(json);
  });
});