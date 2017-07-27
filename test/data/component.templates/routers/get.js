var assert = require("assert");

module.exports = function (req, res, scope) {
  assert(scope.mid1);
  assert(scope.mid2);
  assert(scope.mid3);
  res.send('get');
};
