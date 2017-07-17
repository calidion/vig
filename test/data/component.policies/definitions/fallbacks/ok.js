module.exports = function(err, req, res, next) {
  res.status(403).send('Fail back!');
}