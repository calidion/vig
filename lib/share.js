var url = require('url');
var pathRegexp = require('path-to-regexp');

var share = {
  _layer: null,
  getFailureCallback: function (item, type) {
    if (item.failures && item.failures[type] && typeof item.failures[type] === 'function') {
      return item.failures[type];
    }
  },
  onPassed: function (req, res, next, cb) {
    return function (passed) {
      if (passed === true) {
        return next();
      }
      if (cb) {
        cb(passed, req, res);
      } else {
        res.status(403).end('Access Denied!');
      }
    };
  },
  getPattenPath: function (req, items) {
    var layer = share.getPattenLayer(req);
    if (!layer) {
      return false;
    }
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var regexp = pathRegexp(item.url);
      if (String(regexp) === String(layer.regexp)) {
        return item.url;
      }
    }
    return false;
  },
  getPattenLayer: function (req) {
    var path = url.parse(req.url).pathname;
    var stack = req.app._router.stack;
    for (var i = 0; i < stack.length; i++) {
      var layer = stack[i];
      if (String(layer.regexp) === String(/^\/?(?=\/|$)/i)) {
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
