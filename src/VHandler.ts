import * as fs from "fs";
import * as fsPath from "path";
import * as async from "async";
import * as _ from "lodash";
import { VEvent } from "./VEvent";
import { VDefinition } from "./VDefinition";
import { HTTP, VBase, VConfig, VError, VAsync, VModel, VMiddleware, VRouter, VEventReader } from "./Components";
import { VFallback, VCondition, VPolicy, VValidator, VPager, VBody, VSession } from "./MiddlewareParsers";

export class VHandler {

  public urls: string[] = [];
  public prefix = "";

  public config: VConfig;
  public condition: VCondition;
  public error: VError;
  public body: VBody;
  public event: VEventReader;
  public middleware: VMiddleware;
  public model: VModel;
  public policy: VPolicy;
  public session: VSession;
  public router: VRouter;
  public async: VAsync;
  public validator: VValidator;
  public fallback: VFallback;
  public pager: VPager;

  public definition: VDefinition;

  protected path: string;

  private parent: VHandler = null;
  private children: VHandler[] = [];

  private eventHandler: VEvent = new VEvent();

  // Current Scope
  private scope: any = {};

  constructor(urls: string[] = null, path: string = "", prefix = "") {
    this.urls = urls || [];

    path = path || "";
    this.path = path;
    this.prefix = prefix;

    if (!urls || !urls.length) {
      this.requireFile("urls");
    }
    if (!prefix) {
      this.requireFile("prefix");
    }

    this.config = new VConfig(path);
    this.pager = new VPager(path);
    this.event = new VEventReader(path);
    this.condition = new VCondition(path);
    this.error = new VError(path);
    this.body = new VBody(path);
    this.model = new VModel(path);
    this.async = new VAsync(path);
    this.session = new VSession(path);
    this.middleware = new VMiddleware(path);
    this.policy = new VPolicy(path);
    this.router = new VRouter(path);
    this.validator = new VValidator(path);
    this.fallback = new VFallback(path);

    this.definition = new VDefinition(path);

    const data = [
      "pager",
      "config",
      "condition",
      "error",
      "body",
      "async",
      "model",
      "session",
      "event",
      "middleware",
      "policy",
      "event",
      "router",
      "validator",
      "fallback"];
    for (let i = 0; i < data.length; i++) {
      const key = data[i];
      this[key].loadOn();
    }
    this.updateFallbacks();
    this.loadStaticScope();
    this.initChildren();
  }

  public requireFile(name: string) {
    const allowedExt = [".js", ".ts", ".json"];
    for (let i = 0; i < allowedExt.length; i++) {
      const dir = fsPath.resolve(this.path, "./" + name);
      const resolve = dir + allowedExt[i];
      if (fs.existsSync(resolve)) {
        const data = require(resolve);
        if (data) {
          this[name] = data;
          break;
        }
      }
    }
  }

  public setUrls(urls: string[]) {
    this.urls = urls;
  }

  public setParent(p: VHandler) {
    this.parent = p;
    this.loadStaticScope();
    for(let i = 0; i < this.children.length; i++) {
      this.children[i].loadStaticScope();
    }
  }

  public setPrefix(prefix) {
    this.prefix = prefix;
  }

  public update(k: string, v) {
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
      error: "errors",
      config: "configs",
      event: "events",
      body: "bodies",
      model: "models",
      async: "asyncs",
      session: "sessions",
      pager: "pagers",
      definition: "definitions",
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
    for (const key of Object.keys(keys)) {
      if (config[keys[key]]) {
        this[key].set(config[keys[key]]);
      } else {
        this[key].set({});
      }
    }
    this.updateFallbacks();
    this.loadStaticScope();
    this.children = [];
  }

  public getScope() {
    return this.scope;
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
      let url = prefix + urls[i];
      url = url.replace(/\/+/g, "/");
      app.all(url, (req, res) => {
        this.run(req, res);
      });
    }
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].attach(app);
    }
  }

  public loadStaticScope() {
    this.config.parse(this.scope);
    this.error.parse(this.scope);
    this.model.parse(this.scope);
    this.definition.parse(this.scope);
    if (this.parent) {
      this.parent.loadStaticScope();
      const parent = this.parent.getScope();
      this.scope = _.merge(parent, this.scope);
    }
    this.eventPrepare();
  }

  public eventPrepare() {
    const events = this.event.get();
    for (const key in events) {
      if (key && events[key]) {
        this.eventHandler.on(key, ((iK) => {
          return async (...args) => {
            args = [this.scope].concat(args);
            await this.event.run(iK, args);
          }
        })(key));
      }
    }
  }

  public async run(req, res) {
    // Scoped Data

    const scope = {
      time: {
        start: new Date()
      }
    };

    for (const key of Object.keys(this.scope)) {
      scope[key] = this.scope[key];
    }

    try {
      // Parsers and processors

      // TODO: enabled server protector here, use condition instead now.

      // Input Data prepare
      await this.body.parse(req, res);

      await this.session.parse(req, res);

      // Middlewares

      // Callback based middlewares
      await this.middleware.process(req, res, scope);

      // Promised based middlewares
      await this.async.run(req, res, scope);

      if (!await this.condition.process(req, res, scope)) {
        return;
      }

      if (!await this.validator.process(req, res, scope)) {
        return;
      }
      this.pager.parse(req, res, scope);
      if (!await this.policy.process(req, res, scope)) {
        return;
      }

      // Final request process
      if (!await this.router.run(req, res, scope)) {
        this.notFound("Not Found!", req, res);
      }
    } catch (e) {
      console.error(e);
    }
  }

  public notFound(error, req, res) {
    res.status(404).send("Not Found!");
  }

  // Deprecated

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

  private initChildren() {
    const subDir = "handlers"
    const resolve = fsPath.resolve(this.path, subDir);
    if (!fs.existsSync(resolve)) {
      return;
    }
    const stat = fs.statSync(resolve);
    // ignore directories
    if (!stat || !stat.isDirectory()) {
      return false;
    }
    this.loadDirectory(resolve);
  }

  private loadDirectory(dir: string) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const absPath = fsPath.resolve(dir, file);
      const stat = fs.statSync(absPath);
      let handler;
      // ignore directories
      if (stat && stat.isDirectory()) {
        handler = new VHandler(null, absPath);
      } else {
        const data = require(absPath);
        handler = new VHandler();
        handler.set(data);
      }
      this.children.push(handler);
      handler.setParent(this);
    });
  }
}
