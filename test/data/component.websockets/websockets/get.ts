import {VWSServer} from "../../../../src/VWSServer";
export = async (message, ws, scope) => {

  console.log("inside get");
  const vws = VWSServer.getInstance()
  vws.broadcast("message", null);
};
