module.exports = {
  urls: ['/add'],
  routers: {
    get: function (req, res) {
      var username = "username" + new Date().getTime();
      var password = "password" + new Date().getTime();
      var User = req.models.User;
      User.create({
        username: username,
        password: password
      }).then(function(created) {
        res.send(created);
      });
    }
  }
};
