module.exports = [{
  urls: ['/file/uploading'],
  routers: {
    methods: ['all'],
    all: function (req, res) {
      res.send('/prevent/all get');
    }
  }
}];
