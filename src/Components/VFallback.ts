/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
import { VHTTPBase } from "./VHTTPBase";

export class VFallback extends VHTTPBase {
  constructor(path = "") {
    super(path)
    this.defaultPath = "fallbacks";
    this.filters = ["condition", "validation", "policy", "validator"]
  }
}
