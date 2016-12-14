var app = require('express')();
var vig = require('vig');
var email = require('./email');
var length = require('./length');
var password = require('./password');
var alias = require('./alias');
var enum1 = require('./enum');
vig.init(app);
vig.addHandler(app, email);
vig.addHandler(app, length);
vig.addHandler(app, password);
vig.addHandler(app, alias);
vig.addHandler(app, enum1);

app.listen(10000, function () {
  console.log('server running on http://localhost:10000');
});
