module.exports = [async (req, res, scope) => {
  scope.mid1 = true;
}, async (req, res, scope) => {
  scope.mid2 = true;
}, async (req, res, scope) => {
  scope.mid3 = true;
}];