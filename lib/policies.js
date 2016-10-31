
var items = [];

var policies = {
  get: function (method, url) {
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
    var url = req.baseUrl || req.url;
    var method = req.method.toLowerCase();
    var item = policies.get(method, url);
    if (item) {
      item.handler(req, res, policies._onPolicyPassed(req, res, next));
    } else {
      next();
    }
  },
  _onPolicyPassed: function (req, res, next) {
    return function (passed) {
      if (passed === true) {
        next();
      } else {
        res.status(403).end('Access Denied!');
      }
    };
  }
};
module.exports = policies;
