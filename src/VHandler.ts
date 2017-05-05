import * as fs from "fs";
import * as async from "async";

import { HTTP } from "./Components/HTTP";

import { VBase, VConfig, VFallback, VCondition, VError, VMiddleware, VPolicy, VRouter, VValidator } from "./Components";

export class VHandler {
  public urls: string[] = [];
  public prefix = "";

  public config: VConfig;
  public condition: VCondition;
  public error: VError;
  public middleware: VMiddleware;
  public policy: VPolicy;
  public router: VRouter;
  public validator: VValidator;
  public fallback: VFallback;
  protected path: string;

  constructor(urls: string[] = null, path: string = "", prefix = "") {
    this.urls = urls || [];
    path = path || "";
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
    const data = ["config", "condition", "error", "middleware", "policy", "router", "validator"];
    for (let i = 0; i < data.length; i++) {
      const key = data[i];
      this[key].loadOn();
    }
    this.updateFallbacks();
  }

  public setUrls(urls) {
    this.urls = urls;
  }

  public setPrefix(prefix) {
    this.prefix = prefix;
  }

  public update(k, v) {
    if (this[k]) {
      this[k].set(v);
    }
  }

  public extend(method, cb) {
    return this.router.extend(method, cb);
  }

  public set(config) {
    const keys = {
      condition: "conditions",
      middleware: "middlewares",
      router: "routers",
      policy: "policies",
      validator: "validations",
      fallback: "failures"
    };
    if (config.urls) {
      this.urls = config.urls;
    }
    if (config.prefix) {
      this.prefix = config.prefix;
    }
    for (const key in keys) {
      if (config[keys[key]]) {
        this[key].set(config[keys[key]]);
      } else {
        this[key].set({});
      }
    }
    this.updateFallbacks();
  }

  public updateFallbacks() {
    const keys = {
      validation: "validator"
    };
    const fallbacks = this.fallback.get();
    const items = Object.keys(fallbacks);
    for (let i = 0; i < items.length; i++) {
      const key = items[i];
      const keyOne = this[keys[key]] || this[key];
      if (keyOne) {
        keyOne.setFailureHandler(fallbacks[key]);
      }
    }
  }

  public attach(app) {
    const prefix = this.prefix || "";
    let urls = [];
    if (this.urls instanceof Array) {
      urls = this.urls;
    }
    for (let i = 0; i < urls.length; i++) {
      const url = prefix + urls[i];
      app.all(url, (req, res) => {
        this.run(req, res);
      });
    }
  }

  public run(req, res) {
    // Middlewares should not be failed
    this.middleware.process(req, res, () => {
      this.policy.process(req, res, () => {
        this.condition.process(req, res, () => {
          this.validator.process(req, res, () => {
            this.router.process(req, res, (error) => {
              this.notFound(error, req, res);
            });
          });
        });
      });
    });
  }

  public notFound(error, req, res) {
    console.warn(error);
    res.status(404).send("Not Found!");
  }

  // public setStatusHandler(status: Number, handler: Function) {
  //   this.onStatusHandlers[String(status)] = handler;
  // }

  public toJSON() {
    const json: any = {};
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
