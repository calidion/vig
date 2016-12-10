var app = require('express')();
var vig = require('vig');
vig.init(app);
vig.addHandler(app, {
  prefix: '/demo',
  urls: ['/', '/hello'],
  routers: {
    get: function (req, res) {
      res.send('Hello world!');
    }
  }
});

app.listen(10000, function () {
  console.log('server running on http://localhost:1000');
});
