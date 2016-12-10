module.exports = {
  prefix: '/all',
  urls: ['/'],
  routers: {
    all: function (req, res) {
      res.send('all');
    }
  }
};
