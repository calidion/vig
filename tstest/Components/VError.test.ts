import 'mocha';
import { VError } from '../../src/Components/VError';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

import * as vig from '../../../lib/'
import * as express from 'express';
import * as request from 'supertest';
import * as common from 'errorable-common';

import * as errorsHandlers from '../../../test/errorsHandlers';

const error = new VError();

var errors, app;

describe('VError', () => {

  before(function () {
    app = express();
    var file = path.resolve(__dirname, '../../../test/errors/vig.js');
    error.set(common);
    error.addFile(file);
    errors = error.generate(null, true);
    vig.init(app, errors);
    vig.addHandlers(app, errorsHandlers);
  });

  it('should get /errors', function (done) {
    request(app)
      .get('/errors')
      .expect(200)
      .end(function (err, res) {
        console.log(err, res.text);
        assert(!err);
        assert.deepEqual(res.body, errors.Success.restify());
        done();
      });
  });

  it('should new VError', () => {
    assert(error);
  });

  it('should generate errors', () => {
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