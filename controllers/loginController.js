const axios = require("axios");

exports.handelLoginSubmition = async (u, p) => {
  const response = await axios.post("/login", {
    username: u,
    password: p,
  });
};

exports.handelLogin = (req, res) => {
  res.status(200).render("sigin", {
    pageTitle: "Login",
  });
};
