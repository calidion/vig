import {VWSServer} from "../../../../src/VWSServer";
export = async (message, ws, scope) => {
  const vws = VWSServer.getInstance()
  vws.broadcast("message", () => {
    return false
  });
};
