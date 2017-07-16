/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
import { VHTTPBase } from "../Components/VHTTPBase";
import { promisify } from "bluebird";
import * as parser from "cookie-parser";
import * as skipper from "skipper";

export class VSession extends VHTTPBase {
  constructor(path) {
    super(path);
    this.defaultPath = "sessions";
  }

  public isType(item: any): boolean {
    return item instanceof Object;
  }

  public async parse(req, res): Promise<boolean> {
    const data = this.check(req);
    if (!data) {
      return false;
    }
    for (const k of Object.keys(data)) {
      let cb = data[k];
      if (!cb) {
        continue;
      }
      if (!(cb instanceof Function)) {
        switch (k) {
          case "cookie":
          case "cookies":
            cb = parser();
            break;
          default:
            continue;
        }
      }
      const cp = promisify(cb);
      await cp.call(cb, req, res);
    }
    return true;
  }
}
