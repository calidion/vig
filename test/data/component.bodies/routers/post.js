module.exports = function (req, res) {
  console.log('inside bodies post');
  res.send(req.body);
};
