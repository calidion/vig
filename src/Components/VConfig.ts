/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

import { VBase } from "./VBase";

export class VConfig extends VBase {
  constructor(path) {
    super(path)
    this.defaultPath = "configs";
  }
  public isType(item: any): boolean {
    return item instanceof Object;
  }

  public parse(scope) {
    if (Object.keys(this.data).length) {
      scope.configs = this.data;
    }
  }
}
