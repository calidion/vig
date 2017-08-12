export = async (message, ws, scope) => {

  ws.send(JSON.stringify({
    event: "post",
    message: "echo " + message
  }));
};
