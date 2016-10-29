'use strict';

var assert = require('assert');
var vig = require('../lib');

describe('vig', function () {
  it('should say hello!', function () {
    assert(vig);
    assert('Hello world!');
  });
});
