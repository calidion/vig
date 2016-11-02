module.exports = [{
  urls: ['/events'],
  events: {
    names: ['@event1', '@event2', 'bad'],
    handlers: {
      '@event1': function (next) {
        next('@event1');
      },
      '@event2': function (next) {
        next('@event2');
      }
    }
  }
}];
