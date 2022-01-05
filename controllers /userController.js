const User = require("../model/userModel");

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    users,
  });
};

exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;
  const deletedUser = await User.findByIdAndDelete(id);
  console.log(deletedUser);
  res.status(200).json({
    status: "success",
    message: "Deleted Succesfully",
    user: null,
  });
};
