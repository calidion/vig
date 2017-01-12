var app = require('express')();
var vig = require('vig');
var user = require('./handlers/user');
var config = require('./config');

var path = require('path');
var dir = path.resolve(__dirname, './models/');
vig.models.addDir(dir);
vig.models.init(config, {
  connection: 'default'
}, function (error, models) {
  if (error) {
    console.error('数据库出错,请检查你的配置！');
    console.error(error, config.connections);
    throw error;
  }
  vig.init(app);
  vig.addHandlers(app, user);
  app.listen(10000, function () {
    console.log('server running on http://localhost:10000');
  });
});


