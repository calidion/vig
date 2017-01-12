
var requires = ['add'];
var modules = [];
for (var i = 0; i < requires.length; i++) {
  modules = modules.concat(require('./' + requires[i]));
}

console.log('inside user');

module.exports = modules;
