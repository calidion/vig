/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

import * as fs from 'fs';
import * as _ from 'lodash';
import { Generator } from 'errorable';
import { VBase } from './VBase';

export class VRouter extends VBase {
  defaultPath = 'routers';
  filters = [
    'all',
    'checkout',
    'copy',
    'delete',
    'get',
    'head',
    'lock',
    'merge',
    'mkactivity',
    'mkcol',
    'move',
    'm-search',
    'notify',
    'options',
    'patch',
    'post',
    'purge',
    'put',
    'report',
    'search',
    'subscribe',
    'trace',
    'unlock',
    'unsubscribe'];
    
  constructor(path = __dirname) {
    super(path)
    this.filterEnabled = true;
  }
}
