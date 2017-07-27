module.exports = [function (req, res, next, scope) {
  console.log("mid1");
  scope.mid1 = true;
  next(true);
}];