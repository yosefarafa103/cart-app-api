const UserModel = require("../models/userModel");

exports.getRootPage = (req, res) =>
  res.status(200).render("template", {
    pageTitle: "Welcome to Our Focken Application!",
  });

exports.getUsers = async (req, res) => {
  const users = await UserModel.find();
  const userComments = await UserModel.find()
    .select("comments")
    .populate("comments");
  const comms = userComments.comments;
  res.status(200).render("homepage", {
    pageTitle: "first page (Home)",
    users,
    comments: comms,
  });
};

exports.getUserData = async (req, res) => {
  const user = await UserModel.findById(req.params.id).populate("comments");
  if (!user) {
    return res.status(404).render("error", {
      message: "Cannot Find User With This ID.",
      pageTitle: "ERROR❌",
    });
  }
  res.status(200).render("userpage", {
    userN: req.params.id,
    user,
    pageTitle: `user: ${user.name}`,
  });
};
exports.getSessionCheckOutPage = async (req, res) => {
  const session = await fetch(
    `http://127.0.0.1:5001/booking/checkout-session/${req.params.userId}`
  );
  console.log(res.session);
  res.status(200).send("pay");
};
