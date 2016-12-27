module.exports = {
  prefix: '/phone',
  urls: ['/'],
  routers: {
    all: function (req, res) {
      var extracted = req.extracted;
      if (extracted && extracted.query) {
        res.send(extracted.query.phone + '\n');
      } else {
        res.send('ok');
      }
    }
  },
  validations: {
    get: {
      required: ['query'],
      query: {
        phone: {
          type: 'phone'
        }
      }
    }
  },
  failures: {
    validation: function (err, req, res, next) {
      res.send('phone validation falied!\n');
    }
  }
};
