'use strict';
var assert = require('assert');
var share = require('../lib/share');

describe('vig #share', function () {
  it('should handle callback ', function (done) {
    var cb = share.onPassed();
    cb(false, function () {
      assert(true);
      done();
    });
  });
});
