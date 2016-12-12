var app = require('express')();
var vig = require('vig');
var query = require('./query');
vig.init(app);
vig.addHandler(app, query);

app.listen(10000, function () {
  console.log('server running on http://localhost:10000');
});
