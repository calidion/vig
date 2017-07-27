import * as assert from "assert";

export = async (req, res, scope) => {
  const { template } = scope;
  res.send(template.render({ username: "VIG" }, "h2"));
};
