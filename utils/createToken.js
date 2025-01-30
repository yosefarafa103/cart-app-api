const jwt = require("jsonwebtoken");

function createToken(payload) {
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: "7d" || process.env.EXPIRES_IN,
  });
}
module.exports = createToken;
