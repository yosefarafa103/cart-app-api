const { catchAsycErr } = require("./Errors");
const User = require("./models/userModel");
const jwt = require("jsonwebtoken");
const client = require("redis").createClient();
const DEFAULT_EXPIRATION = 3600;
client.connect();
const getUserFromCache = async (key, res) => {
  if (await client.get(key)) {
    res?.status(200)?.json(JSON.parse(await client.get(key)));
    return;
  }
};
const setCache = (key, data) => {
  client.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(data));
};
exports.getAllUsers = async (req, res, next) => {
  // await getUserFromCache("users", res);
  const user = await User.find({}, { __v: false });
  // setCache("users", user);
  res.status(200).json({
    status: "success",
    usersLength: user.length,
    users: user,
  });
};
exports.deleteUser = async (req, res, next) => {
  await User.findByIdAndDelete({ _id: req.params.id });
  res.status(204).json({
    status: "success",
  });
};
exports.getSingleUser = async (req, res, next) => {
  await getUserFromCache(`${req.params.id}`, res);
  const user = await User.findById(req.params.id);
  setCache(`user_${req.params.id}`, user);
  // .populate("comments")
  // .select("text rating createdAt");
  if (!user) {
    return next("not found user");
  }
  res.status(200).json(user);
};
exports.deleteAllUsers = async (req, res, next) => {
  await User.deleteMany();
  res.status(204).json({});
};

exports.getAllComments = async (req, res, next) => {
  const userComments = await User.findById(req.params.id)
    .populate("comments")
    .select("comments");
  res.status(200).json(userComments);
};
