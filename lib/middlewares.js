var share = require('./share');
var items = [];

var middlewares = {
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
  add: function (method, options) {
    options.urls.forEach(function (url) {
      items.push({
        url: options.prefix + url,
        method: method,
        handler: options.middleware
      });
    });
  },
  use: function (req, res, next) {
    var url = share.getPattenPath(req, items);
    var method = req.method.toLowerCase();
    var item = middlewares._get(method, url);
    if (item) {
      item.handler(req, res, next);
    } else {
      next();
    }
  }
};
module.exports = middlewares;
