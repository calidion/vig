export = async (message, ws, scope) => {

  console.log("inside post");
  ws.send(JSON.stringify({
    event: "post",
    message: "echo " + message
  }));
};
