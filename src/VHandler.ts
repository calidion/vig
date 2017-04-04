import * as fs from 'fs';
import * as async from 'async';

import { HTTP } from './HTTP';

import { VBase, VConfig, VFallback, VCondition, VError, VMiddleware, VPolicy, VRouter, VValidator } from './Components';

export class VHandler {
  protected urls: Array<String> = [];
  protected path: String;
  protected prefix = "";

  protected config: VConfig;
  protected condition: VCondition;
  protected error: VError;
  protected middleware: VMiddleware;
  protected policy: VPolicy;
  protected router: VRouter;
  protected validator: VValidator;
  protected fallback: VFallback;

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
    this.condition = new VCondition(path);
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

  attach(app) {
    let urls = [];
    for (var i = 0; i < this.urls.length; i++) {
      var url = this.prefix + this.urls[i];
      app.use(url, (req, res) => {
        this.run(req, res);
      });
    }
  }

  run(req, res) {
    // Middlewares should not be failed
    this.middleware.process(req, res, () => {
      this.condition.process(req, res, () => {
        this.validator.process(req, res, () => {
          this.policy.process(req, res, () => {
            this.router.process(req, res, (error) => {
              if (error) {
                res.status(404).send('Not Found!');
              }
            });
          });
        });
      });
    });
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
