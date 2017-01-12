var mysqlConf = {
  adapter: 'mysql',
};
var mongoConf = {
  adapter: 'mongo',
  url: process.env.FORIM_MONGO_DB_URI || 'mongodb://127.0.0.1:27017/forim'
};
var mongoAdapter = require('sails-mongo');
var mysqlAdapter = require('sails-mysql');

var mongo = require
module.exports = {
  adapters: {
    mongo: mongoAdapter,
    mysql: mysqlAdapter
  },
  connections: {
    default: mongoConf,
    mongo: mongoConf,
    mysql: mysqlConf
  },
  defaults: {
    migrate: 'alter'
  }
};
