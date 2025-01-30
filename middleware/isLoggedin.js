module.exports = (req, res, next) => {
  console.log("cookies: ", req.cookies);
  if (req.cookies.jsonwebtoken) {
    next();
  } else {
    return next("jwt cookie is not defined, please login");
    // console.log("jwt cookie is not defined");
  }
  // next();
};
