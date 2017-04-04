module.exports = function (error, req, res) {
      res.status(403).send('Access Denied Due to Failure to conditions');
};