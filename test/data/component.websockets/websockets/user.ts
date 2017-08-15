export = async (ws, req, scope) => {
  console.log("inside user socket info");
  console.log(req.session.user);
  ws.send(JSON.stringify(req.session.user));
};
