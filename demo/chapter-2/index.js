var app = require('express')();
var vig = require('vig');
var all = require('./all');
var gs = require('./get-set');
vig.init(app);
vig.addHandler(app, all);
vig.addHandler(app, gs);

app.listen(10000, function () {
  console.log('server running on http://localhost:10000');
});
