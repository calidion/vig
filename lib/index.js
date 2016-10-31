'use strict';
const EventEmitter = require('events');
class VigEmitter extends EventEmitter { }
const emitter = new VigEmitter();
var chalk = require('chalk');

// The actions vig routing system will handle.
var actions = [
  'routers',
  'validations',
  'policies'];

var policies = require('./policies');
var validations = require('./validations');

var httpMethods = require('./http/methods');

var vig = {
  policies: policies,
  validations: validations,
  addController: function (app, handlers) {
    for (var i = 0; i < handlers.length; i++) {
      var handler = handlers[i];
      vig.addHandler(app, handler);
      vig.addEvents(handler.events);
    }
  },
  addHandler: function (app, handler) {
    var urls = handler.urls;
    for (var j = 0; j < urls.length; j++) {
      var url = urls[j];
      for (var k = 0; k < actions.length; k++) {
        var action = actions[k];
        if (handler[action] && handler[action].methods) {
          var methods = handler[action].methods;
          for (var i = 0; i < methods.length; i++) {
            var method = methods[i];
            vig.addAction({
              method: method.toLowerCase(),
              url: url,
              action: action
            }, app, handler[action][method]);
          }
        }
      }
    }
  },
  addAction: function (options, app, handler) {
    if (httpMethods.indexOf(options.method) === -1) {
      console.error(chalk.red('HTTP Method ' + options.method.toUpperCase() + ' is not valid!'));
      return;
    }
    switch (options.action) {
      case 'routers':
        vig.addRouters(options.method, options.url, app, handler);
        break;
      case 'policies':
        policies.add(options.method, options.url, handler);
        break;
      case 'validations':
      default:
        vig.addValidations(options.method, options.url, handler);
        break;
    }
  },
  addRouters: function (method, url, app, handler) {
    if (handler) {
      app[method](url, handler);
    }
  },
  addValidations: function (method, url, handler) {

  },
  addEvents: function (events) {
    for (var event in events) {
      if (typeof event === 'string' && typeof events[event] === 'function') {
        emitter.on(event, events[event]);
      }
    }
  }
};

module.exports = vig;
