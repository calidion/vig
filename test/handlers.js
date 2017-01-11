'use strict';

var vig = require('../lib');
var Handler = require('../lib/handlers');
var app;

describe('vig #handlers', function () {
  it('should init a handle', function () {
    var handler = new Handler(vig, app);
    handler.add();
  });
});
