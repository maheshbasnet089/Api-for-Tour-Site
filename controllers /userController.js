const User = require("../model/userModel");

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    users,
  });
};
