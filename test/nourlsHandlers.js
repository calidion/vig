module.exports = [{
  prefix: '/nourls',
  urls: [],
  routers: {
    all: function (req, res) {
      var id = req.params.id;
      res.send('nourls' + id);
    }
  }
}, {
  prefix: '/nourls/',
  routers: {
    all: function (req, res) {
      var id = req.params.id;
      res.send('nourls' + id);
    }
  }
}];
