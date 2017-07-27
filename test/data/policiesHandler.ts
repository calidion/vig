export = [{
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
    get: async (req, res, scope) => {
      return (true);
    },
    post: async (req, res, scope) => {
      return (true);
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
    get: async (req, res, scope) => {
      if (!req.session || !req.session.user) {
        return (false);
      } else {
        return (true);
      }
    }
  }
}];
