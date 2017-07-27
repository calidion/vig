export = [{
  urls: ['/index', '/', '/be/ok'],
  routers: {
    get: function (req, res) {
      res.send('get');
    },
    post: function (req, res) {
      res.send('post');
    },
    bad: function () {

    }
  },
  validations: {
    methods: ['all'],
    all: async (req, res, scope) => {
      return(true);
    }
  },
  events: {
    sending: function (data, cb) {
      cb(data);
    },
    receiving: function (data, cb) {
      cb(data);
    }
  }
}];
