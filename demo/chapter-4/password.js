module.exports = {
  prefix: '/password',
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
        password : {
          type: 'string',
          required: true
        },
        confirm: {
          matches: 'password'
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
