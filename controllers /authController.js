const User = require("../model/userModel");

exports.signUp = async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    password: req.body.password,
    password: req.body.passwordConfirm,
    email: req.body.email,
  });
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
};
