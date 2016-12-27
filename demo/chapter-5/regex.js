module.exports = {
  prefix: '/regex',
  urls: ['/'],
  routers: {
    all: function (req, res) {
      var extracted = req.extracted;
      if (extracted && extracted.query) {
        res.send(extracted.query.regex + '\n');
      } else {
        res.send('ok');
      }
    }
  },
  validations: {
    get: {
      required: ['query'],
      query: {
        regex: {
          type: 'regex',
          regex: /[a-z]{3}/,
          required: true
        }
      }
    }
  },
  failures: {
    validation: function (err, req, res, next) {
      res.send('regex validation falied!\n');
    }
  }
};
