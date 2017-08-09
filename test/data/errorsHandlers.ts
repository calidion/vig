export = [{
  urls: ['/errors'],
  routers: {
    get: function (req, res) {
      res.errorize(res.errors.Success);
    },
    post: function (req, res) {
      res.restify(res.errors.Failure);
    },
    put: function (req, res) {
      res.restify(res.errors.VigTestError);
    }
  }
}];
