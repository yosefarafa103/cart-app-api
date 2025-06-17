module.exports = (req, res, next) => {
  console.log("cookies: ", req.cookies);
  if (!req.cookies.jsonwebtoken) {
    return next("This Is Protected Route.. please login to continue");
  }
  next();
};
