import { VWSServer } from "./VWSServer";
import * as http from "http";

/**
 * VService is A Service can be a standard alone server or as a part of a server
 */

export class VService {
  protected options;
  constructor(options: any = {}) {
    options.ip = options.ip || "127.0.0.1";
    options.port = options.port || 8080;
    this.options = options;
  }

  public defaultRun() {
    const { port, ip } = this.options;
    console.log("Server Successfully Running On " + ip + ":" + port);
  }

  public start(app, cb) {
    const server = http.createServer(app);
    const vwss = VWSServer.getInstance();
    vwss.start(server);
    server.listen(this.options.port, this.options.ip, () => {
      this.defaultRun();
      cb && cb(server, this.options, vwss);
    });
  }
}
