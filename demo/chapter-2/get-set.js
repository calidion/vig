module.exports = {
  prefix: '/get-set',
  urls: ['/'],
  routers: {
    get: function (req, res) {
      res.send('get');
    },
    post: function (req, res) {
      res.send('post');
    }
  }
};
