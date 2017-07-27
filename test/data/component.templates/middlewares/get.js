module.exports = [function (req, res, next, scope) {
  console.log("mid1");
  scope.mid1 = true;
  next();
}, function (req, res, next, scope) {
  console.log("mid2");
  scope.mid2 = true;
  next();
}, function (req, res, next, scope) {
  console.log("mid3");
  scope.mid3 = true;
  next();
}];