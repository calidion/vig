import 'mocha';
import { VHandler, VRouter } from '../src';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
// import * as vig from '../lib/';

import * as express from 'express';

const app = express();
import * as request from 'supertest';

var componentPathUrls = path.resolve(__dirname, './data/component.sessions/');
let handler = new VHandler(null, componentPathUrls);
handler.attach(app);
describe('VSession', () => {
  it('should not get', (done) => {
    request(app).get('/sessions').
      expect(200, function (err, res) {
        console.log(err, res.text);
        done();
      });
  });
});