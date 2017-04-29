export = [{
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
      if (req.extracted) {
        res.json(req.extracted);
      } else {
        res.send('post');
      }
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
  failures: {
    validation: function (error, req, res) {
      res.status(403).send('Access Denied Due to Failure to validations');
    },
    condition: function (error, req, res) {
      res.status(403).send('Access Denied Due to Failure to conditions');
    }
  },
  validations: {
    get: function (req, res, next) {
      next(false);
    },
    post: {
      required: ['body'],
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
}, {
  urls: ['/post/:id'],
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
      required: ['body'],
      body: {
        data: {
          type: 'int',
          required: true
        }
      }
    }
  }
}, {
  urls: ['/unded/:id'],
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
      required: {},
      body: {
        data: {
          type: 'int',
          required: true
        }
      }
    }
  }
}, {
  urls: ['/nag/:id'],
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
      required: [],
      body: {
        data: {
          type: 'int',
          required: true
        }
      }
    }
  }
}];
