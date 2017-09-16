/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
import { VHTTPBase } from "../Components/VHTTPBase";
import { promisify } from "bluebird";
import * as parser from "cookie-parser";
import * as skipper from "skipper";
import * as _ from "lodash";

import * as debug from "debug";

const print = debug("vig:session");

export class VSession extends VHTTPBase {
  constructor(path) {
    super(path);
    this.defaultPath = "sessions";
  }

  public isType(item: any): boolean {
    return item instanceof Object;
  }

  public async parse(req, res, scope): Promise<boolean> {
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
            cb = this.toAsync(cb, cb)
            break;
          case "session":
            cb = _.get(scope, ["configs", "session", "middleware"]);
            if (!cb) {
              print("Session Middleware Not Found!");
              print(`Please make sure your session.ts/js file is placed inside configs folder, ` +
                `and with an expressjs compatible session middleware inside this configuration file.`
              );
              return false;
            }
            cb = this.toAsync(cb, cb)
            break;
          default:
            continue;
        }
      }
      await cb(req, res);
    }
    return true;
  }
}
