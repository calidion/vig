module.exports = function (req, res, next) {
  console.log('inside middle all');
  req.mid = 'all';
  next();
};
