exports.catchAsycErr = async (func) => {
  return (req, res, next) => func.catch((err) => next(err));
};
const handelTokenExpires = () =>
  new Error("TOKEN EXPIRES! Login to Take another one ...");
const handelJWTErrors = () =>
  new Error("Invalid Token Please try login again to take another one");
exports.globalErrorMiddleWare = (err, req, res, next) => {
  // if the err is JWT err
  if (err.name === "JsonWebTokenError") {
    err = handelJWTErrors();
  }
  if (err.name === "TokenExpiredError") {
    err = handelTokenExpires();
  }
  res.status(404).json({
    status: "error",
    message: err.message && `${err.message}`,
    err,
  });
};
