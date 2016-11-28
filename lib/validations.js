var _ = require('lodash');
var share = require('./share');
var items = [];

var validations = {
  _get: function (method, url) {
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.url === url) {
        if (item.method === method) {
          return item;
        }
      }
    }
    return null;
  },
  add: function (data, options) {
    options.urls.forEach(function (url) {
      var item = _.extend({}, data);
      item.url = options.prefix + url;
      items.push(item);
    });
  },

  use: function (req, res, next) {
    var url = share.getPattenPath(req, items);
    req.params = share._layer ? share._layer.params : null;
    var method = req.method.toLowerCase();
    var item = validations._get(method, url);
    if (item) {
      if (item.condition) {
        var cb = share.getFailureCallback(item, 'condition');
        return item.condition(req, res, share.onPassed(req, res, function () {
          validations._handling(req, res, item, next);
        }, cb));
      }
      validations._handling(req, res, item, next);
    } else {
      next();
    }
  },
  _handling: function (req, res, item, next) {
    var cb = share.getFailureCallback(item, 'validation');

    // Keys to be parsed.
    var keys = ['query', 'params', 'body'];
    if (!item.validation) {
      return item.handler(req, res, share.onPassed(req, res, next, cb));
    }
    if (typeof item.validation === 'object') {
      req.extracted = {};
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        // continue when no validation specified
        if (!item.validation[key]) {
          continue;
        }
        // when no data provided
        if (Object.keys(req[key]).length <= 0) {
          // return error when data is required
          if (!item.validation.required) {
            continue;
          }
          if (!item.validation.required.indexOf) {
            continue;
          }
          if (item.validation.required.indexOf(key) === -1) {
            continue;
          }
          return share.onPassed(req, res, next, cb)(false);
        }
        var result = req.validate(req[key], item.validation[key]);
        // return error info when validation failed
        if (!result || result.code !== 0) {
          return share.onPassed(req, res, next, cb)(false);
        }
        // saved validated data
        req.extracted[key] = result.data;
      }
      if (Object.keys(req.extracted).length <= 0) {
        delete req.extracted;
      }
      next();
    }
    if (typeof item.validation === 'function') {
      return item.validation(req, res, share.onPassed(req, res, function () {
        item.handler(req, res, share.onPassed(req, res, next, cb));
      }));
    }
    res.status(500).end('Server Internal Error!');
  }
};
module.exports = validations;
