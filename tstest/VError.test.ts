import 'mocha';
import { VError } from '../src/Components/VError';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

const error = new VError();


describe('VError', () => {
  it('should new VError', () => {
    assert(error);
  });

  it('should reset', () => {
    error.reset();
    assert(Object.keys(error.errors).length === 0);
    assert(error.files.length === 0);
  });

  it('should add file', () => {
    var file = path.resolve(__dirname, '../../test/errors/vig.js');
    error.addFile(file);
    assert(error.files.length === 1);
    var file1 = path.resolve(__dirname, '../../test/errors/vig1.js');
    error.addFile(file1);
    assert(error.files.length === 1);
  })

  it('should extends error', () => {
    var file = path.resolve(__dirname, '../../test/errors/vig.js');
    var json = require(file);
    error.extends(json);
    assert(Object.keys(error.errors).length !== 0);
  })

  it('should get File errors', () => {
    var file = path.resolve(__dirname, '../../test/errors/vig.js');
    var json: Object = error.getFile(file);
    assert(Object.keys(json['Vig']).length !== 0);
    var file1 = path.resolve(__dirname, '../../test/errors/vig1.js');
    var json1 = error.getFile(file1);
    assert(Object.keys(json1 === null));
  })

  it('should generate errors', () => {
    var errors = error.generate();
    assert(Object.keys(errors).length !== 0);
    error.extends({
      ABC: {
        Error: {
          messages: {
            'zh-CN': 'ABC测试错误!',
            'en-US': 'ABC Test Error!'
          }
        }
      }
    });
    var errors1 = error.generate('', false);
    assert.notDeepEqual(errors, errors1);
  })
});