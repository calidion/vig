var fileCloudUploader = require('file-cloud-uploader');
var async = require('async');

// supported types
var uploaders = {
  _options: null,
  _onError: function (resolve, reject, cloudFiles) {
    return function (err) {
      if (err) {
        return reject(err);
      }
      resolve(cloudFiles);
    };
  },
  _onUpload: function (resolve, reject, options) {
    var cloudFiles = [];
    return function (err, files) {
      if (err) {
        return reject(err);
      }
      async.each(files, function (file, callback) {
        fileCloudUploader(options.type, file.fd, options.config, function (data) {
          cloudFiles.push(data);
          callback();
        });
      }, uploaders._onError(resolve, reject, cloudFiles));
    };
  },
  asUploader: function (req, res, next) {
    req.cloud = function (name, options) {
      return new Promise(function (resolve, reject) {
        req.file(name).upload(uploaders._onUpload(resolve, reject, options));
      });
    };
    next();
  }
};

module.exports = uploaders;
