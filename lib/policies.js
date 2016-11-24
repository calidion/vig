var share = require('./share');
var items = [];

var policies = {
  _get: function (method, url) {
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
  add: function (method, options, handler) {
    options.urls.forEach(function (url) {
      items.push({
        url: options.prefix + url,
        method: method,
        handler: handler,
        failures: options.failures
      });
    });
  },
  use: function (req, res, next) {
    var url = share.getPattenPath(req, items);
    var method = req.method.toLowerCase();
    var item = policies._get(method, url);
    if (item) {
      var cb = share.getFailureCallback(item, 'policy');
      item.handler(req, res, share.onPassed(req, res, next, cb));
    } else {
      next();
    }
  }
};
module.exports = policies;
