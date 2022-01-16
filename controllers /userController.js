const User = require("../model/userModel");
const AppError = require("../utils /appError");
const factoryFunction = require("../controllers /handlerFactory");

// var filterObj = (obj, ...allowedFields) => {
//   const newObj = {};
//   Object.keys(obj).forEach((el) => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el];
//     console.log(newObj);

//     return newObj;
//   });
// };
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.getAllUsers = factoryFunction.getAll(User);

exports.deleteUser = factoryFunction.deleteOne(User);

exports.updateMe = async (req, res, next) => {
  // body contain password credentials ignore them and throw err
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "You cannot update password in this route, for that got go to updateMyPassword route"
      )
    );
  }
  const { name, email } = req.body;

  // const filteredObj = filterObj(req.body, "name", "email");
  // console.log(filteredObj);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
};
exports.getUser = factoryFunction.getOne(User);

exports.updateUser = factoryFunction.updateOne(User);

exports.deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
};
