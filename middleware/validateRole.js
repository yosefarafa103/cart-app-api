exports.validateRole = (...roles) => {
  return (req, res, next) => {
    const { email } = req.body;
    // const user = await User.findOne({ email });

    if (!roles.includes(req.user[0]?.role)) {
      next("you dont have permessions to continue");
    }
    return next();
    // return res.send("can not deleted!");
  };
};
