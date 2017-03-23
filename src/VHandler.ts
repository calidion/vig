import * as fs from 'fs';

import { HTTP } from './HTTP';

import { VBase, VConfig, VFallback, VCondition, VError, VMiddleware, VPolicy, VRouter, VValidator } from './Components';

export class VHandler {
  protected urls: Array<String> = [];
  protected path: String;
  protected prefix = "";

  protected config: VBase;
  protected condition: VBase;
  protected error: VBase;
  protected middleware: VBase;
  protected policy: VBase;
  protected router: VBase;
  protected validator: VBase;
  protected fallback: VBase;

  constructor(urls: Array<String>, path: string, prefix = "") {
    if (!urls || urls.length <= 0) {
      throw new Error('urls MUST be specified.')
    }
    if (!path) {
      throw new Error('path MUST be specified.')
    }
    if (!fs.existsSync(path)) {
      throw new Error('path MUST exist.')
    }
    this.urls = urls;
    this.path = path;
    this.prefix = prefix;

    this.config = new VConfig(path);
    this.condition = new VConfig(path);
    this.error = new VError(path);
    this.middleware = new VMiddleware(path);
    this.policy = new VPolicy(path);
    this.router = new VRouter(path);
    this.validator = new VValidator(path);
    this.fallback = new VFallback(path);
    var data = ['config', 'condition', 'error', 'middleware', 'policy', 'router', 'validator'];
    for (var i = 0; i < data.length; i++) {
      var key = data[i];
      this[key].loadOn();
    }
  }
  toJSON() {
    var json: any = {};
    json.prefix = this.prefix;
    json.urls = this.urls;
    json.routers = this.router.toMethods();
    json.middlewares = this.middleware.get();
    json.policies = this.policy.toMethods();
    json.validations = this.validator.get();
    json.conditions = this.condition.get();
    json.failures = this.fallback.get();
    return json;
  }
}
