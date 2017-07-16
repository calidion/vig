var assert = require("assert");
module.exports = function (req, res) {
  console.log('inside bodies post');
  assert(!req.cookies);
  res.send(req.body);
};
