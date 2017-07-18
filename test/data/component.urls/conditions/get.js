var assert = require('assert');
module.exports = function (req, res, next, scope) {
  assert(scope.configs.test.a === "1");
  assert(scope.configs.test.b === "2");
  next(false);
};