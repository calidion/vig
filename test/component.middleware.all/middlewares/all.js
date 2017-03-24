module.exports = function (req, res, next) {
  req.mid = 'all';
  next();
};
