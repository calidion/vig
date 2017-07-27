import * as assert from 'assert';
export = async (req, res, scope) => {
  assert(scope.configs.test.a === "1");
  assert(scope.configs.test.b === "2");
  return false;
};