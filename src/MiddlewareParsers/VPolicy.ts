/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
import { VHTTPBase } from "../Components/VHTTPBase";

export class VPolicy extends VHTTPBase {
  constructor(path = "") {
    super(path)
    this.failurable = true;
    this.defaultPath = "policies";
  }
  public isType(item: any): boolean {
    return item instanceof Function
    || typeof item === "string";
  }
}
