const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");
const validateToken = async (req, res, next) => {
  const { email } = req.body;
  let token;
  console.log(res.cookies);

  if (req.cookies?.jsonwebtoken) {
    token = req.cookies.jsonwebtoken;
  } else {
    return next("You Must Have Logged In");
  }
  const u = await User.find({ email })[0];
  const isValidToken = await promisify(jwt.verify)(
    token,
    process.env.TOKEN_SECRET
  );
  console.log(isValidToken);
  req.user = isValidToken.id;
  if (!token || !isValidToken) {
    return next("Token is Not Valid");
  }
  next();
};
module.exports = validateToken;
