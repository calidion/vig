import * as fs from "fs";

import { VFile } from "./VFile"
import { VHandler } from "./VHandler"

import * as bodyParser from "body-parser";
import * as errorize from "errorable-express";
import * as path from "path";

const uploader = new VFile();

/**
 * VService is A Service can be a standard alone server or as a part of a server
 */

export class VService {
  protected handlers = [];

  public include(app, file) {
    const items = require(file);
    let handler;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      handler = new VHandler(
        item.urls,
        __dirname,
        item.prefix
      );
      handler.set(item);
      this.addHandler(app, handler);
    }
  }
  public addHandler(app, handler: VHandler) {
    handler.attach(app);
    this.handlers.push(handler);
  }
  public attach(app) {
    // parse raw xml data
    app.use(bodyParser.raw({
      type: "text/xml"
    }));

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({
      extended: false
    }));

    // to support JSON-encoded bodies
    app.use(bodyParser.json());
  }

  public addHandlers(app, handlers) {
    for (let i = 0; i < handlers.length; i++) {
      const handler = new VHandler(
        handlers[i].urls,
        __dirname,
        handlers[i].prefix
      );
      handler.set(handlers[i]);
      this.addHandler(app, handler);
    }
  }
}
