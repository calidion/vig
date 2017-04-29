/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
import { VHTTPBase } from "./VHTTPBase";

export class VMiddleware extends VHTTPBase {
  constructor(path = __dirname) {
    super(path)
    this.defaultPath = "middlewares";
  }
}
