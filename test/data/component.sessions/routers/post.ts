var assert = require("assert");

export = async (req, res, scope) => {
  const {configs} = scope;
  assert(configs.upload.file === 1);
  res.send('post');
};
