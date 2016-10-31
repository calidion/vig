module.exports = [{
  urls: ['/index', '/', '/be/ok'],
  routers: {
    methods: ['get', 'post', 'bad'],
    get: function (req, res) {
      res.send('get');
    },
    post: function (req, res) {
      res.send('post');
    }
  },
  validations: {
    methods: ['all'],
    all: function (req, res) {
      res.send('validations all');
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
