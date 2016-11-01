module.exports = [{
  urls: ['/'],
  routers: {
    methods: ['get', 'post', 'bad'],
    get: function (req, res) {
      res.errorize(res.errors.Success);
    },
    post: function (req, res) {
      res.restify(res.errors.Failure);
    }
  }
}];
