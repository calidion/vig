export = async (req, res, scope) => {
  console.log('inside one get');
  res.json(scope.configs);
}