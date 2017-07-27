export = async (req, res, scope) => {
  console.log('inside middle all');
  req.mid = 'all';
};
