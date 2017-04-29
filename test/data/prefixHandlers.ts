export = [{
  prefix: '/prefix',
  urls: ['/:id'],
  routers: {
    methods: ['all'],
    all: function (req, res) {
      var id = req.params.id;
      res.send('prefix' + id);
    }
  }
}];
