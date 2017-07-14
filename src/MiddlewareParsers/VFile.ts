import * as uploader from "file-cloud-uploader";
import * as async from "async";
import * as skipper from "skipper";

export class VFile {
  protected name
  protected options
  public cloud(req) {
    return (name, options) => {
      return new Promise((resolve, reject) => {
        req.file(name).upload((err, files) => {
          this._isError(err, resolve, () => {
            const cloudFiles = [];
            async.each(files, (file, cb) => {
              uploader(options.type,
                file.fd,
                options.config,
                (data) => {
                  cloudFiles.push(data);
                  cb();
                });
            }, (err1) => {
              this._isError(err1, reject, () => {
                resolve(cloudFiles);
              });
            });
          })
        });
      });
    };
  }
  public attach(app) {
    app.use(skipper());
    app.use(this.use());
  }
  public use() {
    return (req, res, next) => {
      req.cloud = this.cloud(req);
      next();
    }
  }
  public _isError(err, reject, cb = null) {
    if (err) {
      return reject(err);
    }
    if (cb instanceof Function) {
      cb();
    }
  }
}
