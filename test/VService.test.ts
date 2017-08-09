import 'mocha';

import { VHandler, VService } from '../src';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
import * as request from 'supertest';

var componentPath = path.resolve(__dirname, './data/component/');
var app;



describe('VService', () => {
  before(function () {
    app = express();
  });

});