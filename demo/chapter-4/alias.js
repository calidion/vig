module.exports = {
  prefix: '/alias',
  urls: ['/'],
  routers: {
    all: function (req, res) {
      var extracted = req.extracted;
      if (extracted && extracted.query) {
        res.send(JSON.stringify(extracted.query) + '\n');
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
          type: 'email',
          alias: 'mem'
        }
      }
    }
  },
  failures: {
    validation: function (err, req, res, next) {
      res.send(JSON.stringify(err) + '\n');
    }
  }
};
