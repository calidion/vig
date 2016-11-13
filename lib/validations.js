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
  add: function (item) {
    items.push(item);
  },

  use: function (req, res, next) {
    var url = share.getPattenPath(req, items);
    req.params = share._layer ? share._layer.params : null;
    var method = req.method.toLowerCase();
    var item = validations._get(method, url);
    if (item) {
      if (item.condition) {
        return item.condition(req, res, share.onPassed(req, res, function () {
          validations._handling(req, res, item, next);
        }));
      }
      validations._handling(req, res, item, next);
    } else {
      next();
    }
  },
  _handling: function (req, res, item, next) {
    // Keys to be parsed.
    var keys = ['query', 'params', 'body'];
    if (!item.validation) {
      return item.handler(req, res, share.onPassed(req, res, next));
    }
    if (typeof item.validation === 'object') {
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (Object.keys(req[key]).length > 0) {
          var result = req.validate(req[key], item.validation[key]);
          if (result && result.code === 0) {
            continue;
          }
          return share.onPassed(req, res, next)(false);
        }
      }
      next();
    }
    if (typeof item.validation === 'function') {
      return item.validation(req, res, share.onPassed(req, res, function () {
        item.handler(req, res, share.onPassed(req, res, next));
      }));
    }
    res.status(500).end('Server Internal Error!');
  }
};
module.exports = validations;
