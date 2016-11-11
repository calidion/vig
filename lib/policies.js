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
  add: function (method, url, handler) {
    items.push({
      url: url,
      method: method,
      handler: handler
    });
  },
  use: function (req, res, next) {
    var url = share.getPattenPath(req, items);
    if (!url) {
      return next();
    }
    var method = req.method.toLowerCase();
    var item = policies._get(method, url);
    if (item) {
      item.handler(req, res, share.onPassed(req, res, next));
    } else {
      next();
    }
  }
};
module.exports = policies;
