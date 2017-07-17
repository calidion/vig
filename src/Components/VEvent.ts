/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

import * as _ from "lodash";
import { VBase } from "./VBase";

export class VEventReader extends VBase {

  constructor(basePath) {
    super(basePath)
    this.defaultPath = "events";
  }

  public isType(item: any): boolean {
    return item instanceof Object;
  }

  public async run(key, args) {
    const handler = this.data[key];
    if (handler instanceof Function) {
      await handler.apply(this, args);
    }
  }
}
