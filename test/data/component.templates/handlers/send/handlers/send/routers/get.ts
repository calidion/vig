import * as assert from "assert";

export = async (req, res, scope) => {
  console.log("inside inner");
  assert(scope.configs.test.a);
  res.send('get');
};
