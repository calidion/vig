module.exports = {
  names: ['@eventonce1', '@eventonce2', 'bad'],
  handlers: {
    '@eventonce1': function (next) {
      next('@eventonce1');
    },
    '@eventonce2': function (next) {
      next('@eventonce2');
    }
  }
};
