import * as fs from 'fs';

import { VFile } from './VFile'
import { VHandler } from './VHandler'
var path = require('path');
var errorize = require('errorable-express');

var bodyParser = require('body-parser');

var uploader = new VFile();


/**
 * VService is A Service can be a standard alone server or as a part of a server
 */

export class VService {
  protected handlers = [];
  constructor() {
  }

  include(app, file) {
    var items = require(file);
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var handler = new VHandler(
        item.urls,
        __dirname,
        item.prefix
      );
      handler.set(item);
      handler.attach(app);
    }
    this.handlers.push(handler);
  }
  addHandler(app, handler: VHandler) {
    handler.attach(app);
    this.handlers.push(handler);
  }
  attach(app) {
    // parse raw xml data
    app.use(bodyParser.raw({
      type: 'text/xml'
    }));

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({
      extended: false
    }));

    // to support JSON-encoded bodies
    app.use(bodyParser.json());
  }

  

  addHandlers(app, handlers) {
    for (var i = 0; i < handlers.length; i++) {
      var handler = new VHandler(
        handlers[i].urls,
        __dirname,
        handlers[i].prefix
      );
      handler.set(handlers[i]);
      handler.attach(app);
    }
  }
}