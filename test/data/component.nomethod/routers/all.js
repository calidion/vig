module.exports = function (req, res) {
  var id = req.params.id;
  res.send('nomethod' + id);
};
