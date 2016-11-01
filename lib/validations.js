
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
    var url = req.baseUrl || req.url;
    var method = req.method.toLowerCase();
    var item = validations._get(method, url);
    if (item) {
      if (item.condition) {
        return item.condition(req, res, validations._onPolicyPassed(req, res, function () {
          validations._handling(req, res, item, next);
        }));
      }
      validations._handling(req, res, item, next);
    } else {
      next();
    }
  },
  _handling: function (req, res, item, next) {
    if (!item.validation) {
      return item.handler(req, res, validations._onPolicyPassed(req, res, next));
    }
    item.validation(req, res, validations._onPolicyPassed(req, res, function () {
      item.handler(req, res, validations._onPolicyPassed(req, res, next));
    }));
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
module.exports = validations;
