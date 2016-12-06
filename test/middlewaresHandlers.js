module.exports = [{
  urls: ['/middlewares'],
  routers: {
    methods: ['get', 'post', 'bad'],
    get: function (req, res) {
      res.send(req.mid);
    }
  },
  middlewares: {
    get: function (req, res, next) {
      req.mid = 'mid';
      next();
    }
  }
}, {
  urls: ['/middlewares/all'],
  routers: {
    methods: ['get', 'post', 'bad'],
    all: function (req, res) {
      res.send(req.mid);
    }
  },
  middlewares: {
    all: function (req, res, next) {
      req.mid = 'all';
      next();
    }
  }
}];
