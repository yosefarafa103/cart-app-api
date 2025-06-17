const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");
const filterdBody = (bodyObj, ...filedsRoles) => {
  const updatedObj = {};
  Object.keys(bodyObj).forEach((item) => {
    if (filedsRoles.includes(item)) {
      updatedObj[item] = bodyObj[item];
    }
  });
  return updatedObj;
};
exports.blockUser = async (req, res, next) => {
  const inActiveAccount = await User.findOneAndUpdate(
    { _id: req.params.id },
    {
      isActiveAccount: false,
    }
  );
  res.status(200).json({
    user: inActiveAccount,
  });
};
const createSendToken = (data, statusCode, res, message, cookieData, exp) => {
  const token = createToken(data);
  if (cookieData) {
    res.cookie("jsonwebtoken", cookieData, {
      httpOnly: true,
      maxAge: 600000,
    });
  } else {
    res.cookie("jsonwebtoken", token, {
      httpOnly: true,
      maxAge: 600000,
    });
  }
  return res.status(statusCode).json({
    status: message,
    token,
  });
};
exports.logout = async (req, res, next) => {
  res.cookie("jsonwebtoken", "", {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
  });
  res.status(200).send("logout");
};
exports.signin = async (req, res, next) => {
  try {
    let newUser = await User.create(req.body);
    const token = createToken({ id: newUser._id });
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
      token,
    });
  } catch (err) {
    return next(err);
  }
};
exports.login = async (req, res, next) => {
  // check if password and email
  const { email, password } = req.body;
  let user = await User.findOne({ email }).select("-__v");
  console.log(user);
  if (!user) return next("no user with this email");
  if (!user.isActiveAccount) {
    return next("You Can Not Loggin Because Your Account Was Blocked!");
  }
  if (!email || !password) {
    return next("Please Enter Email And Password <Required> ⚠");
  }
  req.user = user;
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    return next("Incorrect Password!");
  }
  createSendToken(
    { id: user._id },
    200,
    res,
    `Login Successfull`
    // 15 * 60 * 1000
  );
};
exports.forgetPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next("not found your email.");
  }
  const resetToken = await user.generateRestPasswordRandomToken();
  user.resetPasswordToken = resetToken;
  await user.save({ validateBeforeSave: false });
  const message = `forget password.. \nplease click to this link:\n * ${
    req.protocol
  }://${req.get(
    "host"
  )}/reset-password/${resetToken}*\n to reset your password!`;
  try {
    // await new Email(user).sendEmail(
    //   "forgetPassword",
    //   `reseting user password: \n ${message}`
    // );
    // await sendEmail({ reciveMail: user.email, message });
    console.log("Message Send Successful!");
    createSendToken({ id: user._id }, 200, res, user);
  } catch (err) {
    return next(err);
  }
};
exports.resetPassword = async (req, res, next) => {
  // get user in the token
  // const hashedToken = createHash("sha256")
  //   .update(req.params.token)
  //   .digest("hex");
  const user = await User.findOne({ resetPasswordToken: req.params.token });
  if (!user) return next("No User Found With This Given Token");
  user.password = req.body.password;
  user.confirmPassword = req.body.password;
  // user.resetPasswordToken = undefined;
  user.changedPasswordAt = Date.now();
  await user.save();
  createSendToken(
    { id: user._id },
    200,
    res,
    `Change User password At ${new Date().getTime()}`
  );
};
exports.updatePassword = async (req, res, next) => {
  // get user in body
  const { email, password, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next("Incorrect Email, Please Enter The Correct One And Try Again!");
  }
  const isMatchedPasswords = await user.isCorrectPassword(
    user.password,
    password
  );
  // check if password is correct
  if (!isMatchedPasswords) {
    return next(
      "Incorrect Password, Please Enter The Correct One And Try Again!"
    );
  }
  // update password if correct
  user.password = newPassword;
  user.confirmPassword = newPassword;
  await user.save();
  const token = createToken({ id: user._id });
  // send jwt to user
  createSendToken(
    { id: user._id },
    200,
    res,
    `Updated User At ${Date.now()}, new Password: ${newPassword}`
  );
};
exports.updateUserPassword = async (req, res, next) => {
  if (!req.body.email || !req.body.password || !req.body.newPassword)
    return next("provide your credentials");
  const email = await User.findOne({ email: req.body.email });
  if (!email) return next("email is not found");
  const isMatchedPasswords = await bcrypt.compare(
    req.body.password,
    email.password
  );

  // Check If Correct Password
  if (!isMatchedPasswords) return next("incorrect password or email");

  // Check If New Password Is Current One
  const isNewPasswordIsSame = await bcrypt.compare(
    req.body.newPassword,
    email.password
  );
  if (isNewPasswordIsSame)
    return next("this is a current password, try another password!");
  email.password = req.body.newPassword;
  email.changedPasswordAt = Date.now();
  await email.save({ validateBeforeSave: false });
  return createSendToken(
    { id: email._id },
    200,
    res,
    "updated Password Successfull"
  );
};
exports.updateUserData = async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  // Checking If Password, Confirm Password
  if (password || confirmPassword) {
    return next(
      "please enter another email data <no password, confirm password>, to set new password visit /update-password route"
    );
  }
  try {
    // Getting User
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user },
      req.body,
      { runValidators: true, new: true }
    );
    res.send({
      status: "success",
      user: updatedUser,
    });

    // If !User

    if (!updatedUser) return next("invalid user!");
  } catch (err) {
    // Throw Error If Any Problem Happent In Try Block
    return next(err.message);
  }
};
exports.deleteMyData = async (req, res, next) => {
  const inActiveAccount = await User.findOneAndUpdate(
    { _id: req.user },
    {
      isActiveAccount: false,
    }
  );
  // console.log(await User.findOne({ _id: req.user }));
  res.status(200).json({
    user: inActiveAccount,
  });
};
