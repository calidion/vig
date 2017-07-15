export = async(scope, cb) => {
  const {errors} = scope;
  console.log("inside event hello");
  cb('hello', errors);
}