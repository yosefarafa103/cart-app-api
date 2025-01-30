const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = jwt.sign({ _id: Math.random() }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
  res.cookie("token", token, {
    // expires: new Date(Date.now + 86400),
    httpOnly: true,
  });
  console.log(token);
  next();
};
