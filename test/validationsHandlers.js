module.exports = [{
  urls: ['/validations'],
  routers: {
    methods: ['get', 'post', 'bad'],
    get: function (req, res) {
      res.send('get');
    },
    post: function (req, res) {
      res.send('post');
    }
  },
  conditions: {
    get: function (req, res, next) {
      next(true);
    }
  },
  validations: {
    get: function (req, res, next) {
      next(true);
    },
    post: function (req, res, next) {
      next(false);
    }
  }
}, {
  urls: ['/validations/2'],
  routers: {
    methods: ['get', 'post', 'bad'],
    get: function (req, res) {
      res.send('get');
    },
    post: function (req, res) {
      res.send('post');
    }
  },
  conditions: {
    get: function (req, res, next) {
      next(false);
    },
    post: function (req, res, next) {
      next(true);
    }
  },
  validations: {
    get: function (req, res, next) {
      next(false);
    },
    post: {
      query: {
        username: {
          type: 'string',
          required: true,
          maxLength: 30,
          minLength: 2
        },
        password: {
          type: 'string',
          required: true,
          minLength: 6,
          maxLength: 30
        }
      },
      params: {
        id: {
          type: 'int',
          required: true
        }
      },
      body: {
        value: {
          type: 'int',
          required: true
        }
      }
    }
  }
}, {
  urls: ['/params/:id'],
  routers: {
    methods: ['get', 'post'],
    get: function (req, res) {
      res.send('get');
    },
    post: function (req, res) {
      res.send('post');
    }
  },
  validations: {
    get: function (req, res, next) {
      next(false);
    },
    post: {
      params: {
        id: {
          type: 'int',
          required: true
        }
      }
    }
  }
}];
