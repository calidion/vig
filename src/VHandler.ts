import * as fs from "fs";
import * as fsPath from "path";
import * as async from "async";
import * as _ from "lodash";
import { VEvent } from "./VEvent";
import { VDefinition } from "./VDefinition";
import { HTTP, VBase, VConfig, VError, VModel, VMiddleware, VRouter, VEventReader, VWebSocket } from "./Components";
import { VFallback, VCondition, VPolicy, VValidator, VPager, VBody, VSession } from "./MiddlewareParsers";

import { VTemplate } from "./Templates/VTemplate";

import { VWSServer } from "./VWSServer";

import { promisify } from "bluebird";

import * as debug from "debug";

import * as url from "url";

const print = debug("vig:vhandler");

export class VHandler {

  public urls: string[] = [];
  public prefix = "";

  public config: VConfig;
  public condition: VCondition;

  public error: VError;
  public body: VBody;
  public event: VEventReader;

  // Expressjs Traditional Middle
  public middleware: VMiddleware;
  public model: VModel;
  public policy: VPolicy;
  public session: VSession;
  public router: VRouter;
  public validator: VValidator;
  public fallback: VFallback;

  // VWebSocket
  public websocket: VWebSocket;

  // Pagination Parser
  public pager: VPager;

  public template: VTemplate;

  public definition: VDefinition;

  protected path: string;

  private parent: VHandler = null;
  private children: VHandler[] = [];

  private eventHandler: VEvent = VEvent.getInstance();

  // Current Scope
  private scope: any = {};

  private unmuted: any = {

  };

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
    this.session = new VSession(path);
    this.middleware = new VMiddleware(path);
    this.policy = new VPolicy(path);
    this.router = new VRouter(path);
    this.validator = new VValidator(path);
    this.fallback = new VFallback(path);
    this.template = new VTemplate(path);
    this.websocket = new VWebSocket(path);

    this.definition = new VDefinition(path);

    const data = [
      "pager",
      "config",
      "condition",
      "error",
      "body",
      "model",
      "session",
      "event",
      "middleware",
      "policy",
      "event",
      "router",
      "validator",
      "websocket",
      "fallback"];
    for (const key of data) {
      this[key].loadOn();
    }
    this.updateFallbacks();
    this.loadStaticScope();
    this.initChildren();
  }

  public requireFile(name: string) {
    const allowedExt = [".js", ".ts", ".json"];
    for (const ext of allowedExt) {
      const dir = fsPath.resolve(this.path, "./" + name);
      const resolve = dir + ext;
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
    this.template.setParent(p.template);
    const parent = this.parent.getScope();
    const clone = _.merge({}, parent);
    const scope = _.merge({}, this.scope);
    this.scope = _.merge(clone, scope);
    for (const child of this.children) {
      child.setParent(this);
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
      session: "sessions",
      pager: "pagers",
      definition: "definitions",
      policy: "policies",
      websocket: "websockets",
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
    for (const key of items) {
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
    for (const item of urls) {
      let urlTemp = prefix + item;
      urlTemp = urlTemp.replace(/\/+/g, "/");
      app.all(urlTemp, (req, res) => {
        this.run(req, res);
      });
    }
    for (const child of this.children) {
      child.attach(app);
    }
  }

  public loadStaticScope() {
    this.config.parse(this.scope);
    this.error.parse(this.scope);
    this.definition.parse(this.scope);
    this.eventPrepare();
    this.websocketPrepare();

    // Accelerate speed by ignoring unnecessary processes
    this.processMuted();
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

  public websocketPrepare() {
    const wss = VWSServer.getInstance();
    const websocketHandlers = this.websocket.get();
    for (const key in websocketHandlers) {
      if (key && websocketHandlers[key] instanceof Function) {
        wss.addEventListener(key, this);
      }
    }
  }

  public getFixedScope() {
    const scope: any = {
      time: {
        start: new Date()
      }
    };

    for (const key of Object.keys(this.scope)) {
      scope[key] = this.scope[key];
    }

    this.model.parse(scope);

    scope.template = this.template;
    return scope;
  }

  public checkMutable(module) {
    return Object.keys(this[module].get()).length > 0;
  }

  public processMuted() {
    const mutables = ["body", "session", "condition", "policy", "middleware", "condition", "validator", "pager"];
    for (const key of mutables) {
      this.unmuted[key] = this.checkMutable(key);
    }
  }

  public async run(req, res) {
    // Scoped Data
    const scope: any = this.getFixedScope();

    try {
      // Parsers and processors

      // TODO: enabled server protector here, use condition instead now.

      // Input Data prepare
      if (req.method === "POST" || this.unmuted.body) {
        await this.body.parse(req, res);
      }
      if (this.unmuted.session) {
        await this.session.parse(req, res, scope);
      }
      // Utilities
      res.vRender = (data, template, ext = "html") => {
        // Add user session to current User
        if (req.session && req.session.user) {
          data.currentUser = req.session.user;
        }
        // Add configs to template defaultly
        data.config = scope.configs;
        res.send(this.template.render(data, template, ext));
      };

      res.errorize = res.restify = function errorize(error, data) {
        if (!error) {
          return res.json(scope.errors.UnknownError.restify());
        }
        if (error.restify && error.restify instanceof Function) {
          error = error.restify();
        }
        if (!data) {
          return res.json(
            _.extend(error)
          );
        }
        return res.json(
          _.extend(error, { data })
        );
      };
      // Middlewares
      // Exit when middleware return false

      if (this.unmuted.middleware && await this.middleware.process(req, res, scope) === false) {
        return;
      }
      if (this.unmuted.condition && !await this.condition.process(req, res, scope)) {
        return;
      }

      if (this.unmuted.validator && !await this.validator.process(req, res, scope)) {
        return;
      }
      if (this.unmuted.pager) {
        await this.pager.parse(req, res, scope);
      }
      if (this.unmuted.policy && !await this.policy.process(req, res, scope)) {
        return;
      }
      // Final request process
      const result = await this.router.run(req, res, scope);
      if (false === result) {
        return this.notFound("Not Found!", req, res);
      }
    } catch (e) {
      print(e);
    }
  }

  public notFound(error, req, res) {
    res.status(404).send("Not Found!");
  }

  // Web sockets
  public async wsEvent(event, message, ws, req) {
    const cookies = req.headers.cookie;
    const store = _.get(this.scope, ["configs", "session", "store"]);

    if (this.unmuted.session && cookies && store) {
      let id = cookies.split("=");
      id = id[1];
      id = decodeURIComponent(id);
      id = id.split(".")[0].split(":")[1];
      const getSession = promisify(store.get);
      const session = await getSession.call(store, id);
      req.session = session;
    }
    await this.websocket.run(event, message, ws, req, this.scope);
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
