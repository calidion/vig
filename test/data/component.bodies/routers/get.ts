var assert = require("assert");
export = async (req, res, scope) => {
  assert(req.cookies);
  assert(scope.asyncs.get);
  res.send('get');
};
