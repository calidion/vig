/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

import { VHTTPBase } from './VHTTPBase';

export class VValidator extends VHTTPBase {
  defaultPath = 'validators';
  paramKeys = ['required', 'params', 'query', 'body']
  constructor(path = __dirname) {
    super(path)
  }
  isType(item: any): Boolean {
    if (item instanceof Object) {
      for (var k in item) {
        if (this.paramKeys.indexOf(k) === -1) {
          console.error('params error!');
          return false;
        }
        if (k === 'required') {
          if (!(item[k] instanceof Array)) {
            console.error('required MUST be an array!');
            return false;
          }
        }
      }
    }
    return item instanceof Object || item instanceof Function;
  }
}
