import 'mocha';
import { VError } from '../../src/Components/VError';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

const error = new VError();


describe('VError', () => {
  it('should new VError', () => {
    assert(error);
  });

  it('should generate errors', () => {
    var file = path.resolve(__dirname, '../../../test/errors/vig.js');
    error.addFile(file);
    var errors: any = error.generate();
    assert(errors && errors.VigTestError);
  })

  it('should load', () => {
    var error = new VError(path.resolve(__dirname, '../../../test/'));
    var data: any = error.load();
    assert(data);
    var errors: any = error.generate();
    assert(errors && errors.VigTestError);
    errors = error.generate('', false);
    assert(errors && errors.VigTestError);
    error.filter();
  })
});