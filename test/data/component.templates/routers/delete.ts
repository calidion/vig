export = async (req, res, scope) => {
  req.session = {
    user: 1
  };
  res.vRender({ username: "VIG" }, "layout");
};
