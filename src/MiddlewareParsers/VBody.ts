/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
import { VHTTPBase } from "../Components/VHTTPBase";

import { promisify } from "bluebird";

import * as parser from "body-parser";

export class VBody extends VHTTPBase {
  constructor(path) {
    super(path);
    this.defaultPath = "bodies";
  }

  public async parse(req, res): Promise<boolean> {
    const data = this.check(req);
    for (const k in data) {
      let cb = data[k];
      if (!cb) {
        continue;
      }
      if (!(cb instanceof Function)) {
        switch (k) {
          case 'formdata':
          case 'form':
            cb = parser.urlencoded({ extended: false });
            break;
          case 'xml':
            cb = parser.raw({ type: '*/xml' });
            break;
          case 'json':
            cb = parser.json();
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
