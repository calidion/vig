var assert = require("assert");

export = async (req, res, scope) => {
  const {configs} = scope;
  res.send('get');
};
