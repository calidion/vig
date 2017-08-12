import * as assert from "assert";

export = async (req, res, scope) => {
  assert(scope.configs.test.a);
  res.send('get');
};
