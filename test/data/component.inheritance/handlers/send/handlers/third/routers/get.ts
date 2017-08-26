export = async (req, res, scope) => {
  console.log('inside get');
  res.json(scope.configs);
}