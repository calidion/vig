/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
import { VHTTPBase } from "../Components/VHTTPBase";
import { promisify } from "bluebird";
import * as parser from "body-parser";
import * as skipper from "skipper";

export class VBody extends VHTTPBase {
  constructor(path) {
    super(path);
    this.defaultPath = "bodies";
  }

  public isType(item: any): boolean {
    return item instanceof Object;
  }

  public file(req) {
    return async (name) => {
      const cb = promisify(req.file(name).upload);
      return await cb.call(req.file(name));
    }
  }

  public async parse(req, res): Promise<boolean> {
    let data = this.check(req);
    if (!data) {
      const method = req.method.toLowerCase();
      // Enable form for post request
      if (method === "post") {
        data = {
          form: true
        };
      }
    }
    for (const k of Object.keys(data)) {
      let cb = data[k];
      if (!cb) {
        continue;
      }
      if (!(cb instanceof Function)) {
        switch (k) {
          case "formdata":
          case "form":
            cb = parser.urlencoded({ extended: false });
            cb = this.toAsync(cb, cb)
            break;
          case "xml":
            cb = parser.raw({ type: "*/xml" });
            cb = this.toAsync(cb, cb)
            break;
          case "json":
            cb = parser.json();
            cb = this.toAsync(cb, cb)

            break;
          case "file":
            cb = skipper();
            req.storage = this.file(req);
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
