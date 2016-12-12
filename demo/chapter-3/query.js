module.exports = {
  prefix: '/query',
  urls: ['/'],
  routers: {
    all: function (req, res) {
      var extracted = req.extracted;
      if (extracted && extracted.query) {
        res.send(extracted.query.id);
      } else {
        res.send('ok');
      }
    }
  },
  validations: {
    get: {
      required: ['query'],
      query: {
        id: {
          type: 'int'
        }
      }
    }
  },
  failures: {
    validation: function (err, req, res, next) {
      res.send('id validation falied!');
    }
  }
};
