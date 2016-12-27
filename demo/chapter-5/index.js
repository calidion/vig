var app = require('express')();
var vig = require('vig');
var phone = require('./phone');
var regex = require('./regex');
vig.init(app);
vig.addHandler(app, phone);
vig.addHandler(app, regex);

app.listen(10000, function () {
  console.log('server running on http://localhost:10000');
});
