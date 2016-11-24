module.exports = [{
  prefix: '/nomethod',
  urls: ['/:id', '/hello/:id'],
  routers: {
    all: function (req, res) {
      var id = req.params.id;
      res.send('nomethod' + id);
    }
  }
}];
