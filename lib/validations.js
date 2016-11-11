
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
    // Keys to be parsed.
    var keys = ['query', 'params', 'body'];
    if (!item.validation) {
      return item.handler(req, res, validations._onPolicyPassed(req, res, next));
    }
    if (typeof item.validation === 'object') {
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (req[key]) {
          var result = req.validate(req[key], item.validation[key]);
          if (result && result.code === 0) {
            continue;
          }
          return validations._onPolicyPassed(req, res, next)(false, function () {
            res.errorize(result);
          });
        }
      }
    }
    item.validation(req, res, validations._onPolicyPassed(req, res, function () {
      item.handler(req, res, validations._onPolicyPassed(req, res, next));
    }));
  },
  _onPolicyPassed: function (req, res, next) {
    return function (passed, cb) {
      if (passed === true) {
        next();
      } else {
        if (cb) {
          cb();
        } else {
          res.status(403).end('Access Denied!');
        }
      }
    };
  }
};
module.exports = validations;
