const createToken = require("./createToken");

const generateToken = () => createToken({ t: 123 });
module.exports = generateToken;
