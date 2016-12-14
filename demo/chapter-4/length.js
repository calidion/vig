module.exports = {
  prefix: '/length',
  urls: ['/'],
  routers: {
    all: function (req, res) {
      var extracted = req.extracted;
      if (extracted && extracted.query) {
        res.send(extracted.query.length + '\n');
      } else {
        res.send('ok');
      }
    }
  },
  validations: {
    get: {
      required: ['query'],
      query: {
        length : {
          type: 'string',
          maxLength: 5,
          minLength: 3,
          required: true
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
