
// database connections
var mysql = require('./databases/mysql');
var mongodb = require('./databases/mongodb');


// 这里的adapter的值，就是adapter.js里面的字段名
mysql.adapter = 'mysql';
mongodb.adapter = 'mongodb';

module.exports = {
  default: mysql,
  mysql: mysql,
  mongodb: mongodb
};
