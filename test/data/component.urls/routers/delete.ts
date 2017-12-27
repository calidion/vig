export = async (req, res, scope) => {
  res.vRender({ username: "VIG" }, "layout", 'html');
};
