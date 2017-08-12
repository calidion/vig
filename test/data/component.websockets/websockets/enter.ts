export = async (message, ws, scope) => {

  console.log("inside enter");

  ws.send("hello");

};
