import * as uploader from 'file-cloud-uploader';
import * as async from 'async';
import * as skipper from 'skipper';

export class VFile {
  name
  options
  _isError(err, reject, cb) {
    if (err) {
      return reject(err);
    }
    cb();
  }

  cloud(req) {
    return (name, options) => {
      return new Promise((resolve, reject) => {
        req.file(name).upload((err, files) => {
          this._isError(err, resolve, () => {
            var cloudFiles = [];
            async.each(files, (file, cb) => {
              uploader(options.type,
                file.fd,
                options.config,
                (data) => {
                  cloudFiles.push(data);
                  cb();
                });
            }, (err) => {
              this._isError(err, reject, () => {
                resolve(cloudFiles);
              });
            });
          })
        });
      });
    };
  }
  attach(app) {
    app.use(skipper());
    app.use(this.use());
  }
  use() {
    var self = this;
    return function(req, res, next) {
      req.cloud = self.cloud(req);
      next();
    }
  }
}