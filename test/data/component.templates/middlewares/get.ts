module.exports = [async (req, res, scope) => {
  console.log("mid1");
  scope.mid1 = true;
}, async (req, res, scope) => {
  console.log("mid2");
  scope.mid2 = true;
}, async (req, res, scope) => {
  console.log("mid3");
  scope.mid3 = true;
}];