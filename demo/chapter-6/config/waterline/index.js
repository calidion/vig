var adapter = require('./adapter');
var connections = require('./connections');

module.exports = {
  adapters: adapter,
  connections: connections,
  defaults: {
    migrate: 'alter'
  }
};
