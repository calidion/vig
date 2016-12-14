module.exports = {
  prefix: '/email',
  urls: ['/'],
  routers: {
    all: function (req, res) {
      var extracted = req.extracted;
      if (extracted && extracted.query) {
        res.send(extracted.query.email + '\n');
      } else {
        res.send('ok');
      }
    }
  },
  validations: {
    get: {
      required: ['query'],
      query: {
        email: {
          type: 'email'
        }
      }
    }
  },
  failures: {
    validation: function (err, req, res, next) {
      res.send('id validation falied!\n');
    }
  }
};
