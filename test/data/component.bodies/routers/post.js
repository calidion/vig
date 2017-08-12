var assert = require("assert");
module.exports = function (req, res) {
  assert(!req.cookies);
  res.send(req.body);
};
