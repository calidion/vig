module.exports = [async (req, res, scope) => {
  console.log("mid1 policiy");
  scope.mid1 = true;
}];