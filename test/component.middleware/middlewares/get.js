module.exports = function (req, res, next) {
  req.mid = 'mid';
  next();
};
