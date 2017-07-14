export = [{
  urls: ['/errors'],
  routers: {
    methods: ['get', 'post', 'put', 'bad'],
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
