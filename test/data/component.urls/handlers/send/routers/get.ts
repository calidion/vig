import * as assert from "assert";

export = async (req, res, scope) => {
  console.log(scope);
  assert(scope.configs.test.a);
  res.send('get');
};
