import {VWSServer} from "../../../../src/VWSServer";
export = async () => {
  const vws = VWSServer.getInstance()
  vws.broadcast("message", () => {
    return false
  });
};
