/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

import { VBase } from "../Components/VBase";

export class VPolicyDefinition extends VBase {
  constructor(path) {
    super(path)
    this.defaultPath = "policies";
  }
  public isType(item: any): boolean {
    return item instanceof Object;
  }
}
