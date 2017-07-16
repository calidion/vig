import * as assert from "assert";

module.exports = async (req, res, scope) => {
  const { User, Pet } = scope.models;
  assert(User);
  assert(Pet);
  res.send('post');
};
