module.exports = [{
  urls: ['/prevent/all'],
  routers: {
    methods: ['get', 'post', 'bad'],
    get: function (req, res) {
      res.send('/prevent/all get');
    },
    post: function (req, res) {
      res.send('post');
    }
  },
  policies: {
    methods: ['all'],
    all: function (req, res) {
      res.status(403).send('Access Denied!');
    }
  }
}, {
  urls: ['/allow/all'],
  routers: {
    methods: ['get', 'post', 'bad'],
    get: function (req, res) {
      res.send('get');
    },
    post: function (req, res) {
      res.send('post');
    }
  },
  policies: {
    methods: ['get', 'post'],
    get: function (req, res, next) {
      next(true);
    },
    post: function (req, res, next) {
      next(true);
    }
  }
}, {
  urls: ['/user/login'],
  routers: {
    methods: ['get', 'post', 'bad'],
    get: function (req, res) {
      req.session.user = 1;
      res.send('login');
    }
  }
}, {
  urls: ['/user/logout'],
  routers: {
    methods: ['get', 'post', 'bad'],
    get: function (req, res) {
      req.session.user = 0;
      res.send('logout');
    }
  }
}, {
  urls: ['/user/profile'],
  routers: {
    methods: ['get', 'post', 'bad'],
    get: function (req, res) {
      res.send('profile');
    }
  },
  policies: {
    methods: ['get'],
    get: function (req, res, next) {
      if (!req.session || !req.session.user) {
        next(false);
      } else {
        next(true);
      }
    }
  }
}];
