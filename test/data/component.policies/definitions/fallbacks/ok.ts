export = async (err, req, res, scope) => {
  res.status(403).send('Fail back!');
}