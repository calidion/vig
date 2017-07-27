module.exports = [function (req, res, next, scope) {
  console.log("mid1 policiy");
  scope.mid1 = true;
  next(false);
}];