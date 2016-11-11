var url = require('url');
var pathRegexp = require('path-to-regexp');

var share = {
  _layer: null,
  onPassed: function (req, res, next) {
    return function (passed, cb) {
      if (passed === true) {
        return next();
      }
      if (cb) {
        cb();
      } else {
        res.status(403).end('Access Denied!');
      }
    };
  },
  matchUrl: function (method, url, items) {
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.url === url) {
        if (item.method === 'all' || method === 'all') {
          return item;
        }
        if (item.method === method) {
          return item;
        }
      }
    }
    return null;
  },

  getPattenPath: function (req, items) {
    var layer = share.getPattenLayer(req);
    if (!layer) {
      return false;
    }
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var regexp = pathRegexp(items[i].url);
      if (String(regexp) === String(layer.regexp)) {
        return items[i].url;
      }
    }
    return false;
  },
  getPattenLayer: function (req) {
    var path = url.parse(req.url).pathname;
    var stack = req.app._router.stack;
    for (var i = 0; i < stack.length; i++) {
      var layer = stack[i];
      if (String(layer.regexp) == String(/^\/?(?=\/|$)/i)) {
        if (!path || path === '/') {
          return layer;
        }
        continue;
      }
      if (layer.match(path)) {
        share._layer = layer;
        return layer;
      }
    }
    return false;
  }
};

module.exports = share;
