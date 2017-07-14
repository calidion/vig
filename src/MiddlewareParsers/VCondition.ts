/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
import { VHTTPBase } from "../Components/VHTTPBase";

export class VCondition extends VHTTPBase {
  constructor(path = "") {
    super(path)
    this.failurable = true;
    this.defaultPath = "conditions";
  }
}
