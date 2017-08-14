export = async (ws, req, scope, message) => {
  ws.send(JSON.stringify({
    event: "post",
    message: "echo " + message
  }));
};
