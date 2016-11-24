'use strict';
var common = require('errorable-common');
var errorable = require('errorable');
var Generator = errorable.Generator;
var errors = new Generator(common, 'zh-CN').errors;

// var assert = require('assert');
var vig = require('../lib');
// var request = require('supertest');
var express = require('express');
var nourlsHandlers = require('./nourlsHandlers');
var app;

describe('vig #nourls', function () {
  it('should init nourls', function () {
    app = express();
    vig.normalize(app);
    vig.init(app, errors);
    vig.addHandlers(app, nourlsHandlers);
  });
});
