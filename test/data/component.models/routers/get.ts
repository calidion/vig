import * as assert from "assert";

export = async (req, res, scope) => {
  const { User, Pet } = scope.models;
  assert(User);
  assert(Pet);
  res.send('get');
};

