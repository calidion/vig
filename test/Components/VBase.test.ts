import 'mocha';
import { VBase } from '../../src/Components/VBase';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

class NewBase extends VBase {
  public isType(): boolean {
    return true;
  }
}

const base = new NewBase(__dirname);

describe('VBase', () => {
  it('should new VBase', () => {
    assert(base);
  });

  it('should reset', () => {
    base.reset();
    assert(Object.keys(base.get()).length === 0);
    assert(base.getFiles().length === 0);
  });

  it('should add file', () => {
    base.addFile();
    var file = path.resolve(__dirname, '../data/errors/vig.js');
    base.addFile(file);
    assert(base.getFiles().length === 1);
    var file1 = path.resolve(__dirname, '../data/errors/vig1.js');
    base.addFile(file1);
    assert(base.getFiles().length === 1);
  })

  it('should extends base', () => {
    var file = path.resolve(__dirname, '../data/errors/vig.js');
    var json = require(file);
    var data = base.extends('', json);
    assert(Object.keys(data).length > 0);
  })

  it('should get File bases', () => {
    var file = path.resolve(__dirname, '../data/errors/vig.js');
    var json: any = base.getFile(file);
    assert(Object.keys(json['Vig']).length !== 0);
    var file1 = path.resolve(__dirname, '../data/errors/vig1.js');
    var json1 = base.getFile(file1);
    assert(json1 === null);
  })

  it('should generate bases', () => {
    var a = {};
    var bases100 = base.generate(a);
    var bases = base.generate();
    assert(Object.keys(bases).length !== 0);
    var bases1 = base.extends('', {
      ABC: {
        base: {
          messages: {
            'zh-CN': 'ABC测试错误!',
            'en-US': 'ABC Test base!'
          }
        }
      }
    }, base);
    assert.notDeepEqual(bases, bases1);
  })

  it('should load wrong dir', () => {
    base.parseDir();
    base.attach({
      use: function() {}
    }, 'hello');
    assert(!base.load('sdfsfdsdf'));
    assert(!base.load('sdfsfdsdf', {aaa: 1}));
  })
});