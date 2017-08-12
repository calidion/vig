export = async(scope, cb) => {
  const {errors} = scope;
  cb('hello', errors);
}