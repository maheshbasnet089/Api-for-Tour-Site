const { promisify } = require("util");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils /appError");

const signInToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    email: req.body.email,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  //jsonwebtoken signin
  const token = signInToken(newUser._id);
  // console.log(token);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
};

exports.logIn = async (req, res, next) => {
  const { email, password } = req.body;

  //check email and password is provided or not
  if (!email || !password) {
    return next(new AppError("Please enter email and password", 400));
  }
  //check if user exits and password is correct

  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.comparePasswords(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  const token = signInToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
};

exports.protectMiddleware = async (req, res, next) => {
  //if there is token in req
  const authorizationHeader = req.headers.authorization;
  let token;
  if (authorizationHeader && authorizationHeader.startsWith("Bearer")) {
    // console.log(authorizationHeader);
    token = authorizationHeader.split(" ")[1];
    // console.log(token);
  }

  if (!token) {
    return next(new AppError("You must be logged in!", 401));
  }
  //verify token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded._id);

  const currentUser = await User.findById(decoded.id);
  // console.log(currentUser);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists", 401)
    );
  }
  //check if the used changed the password after the token was issued
  if (currentUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password,please login again ", 401)
    );
  }
  //grant acces to protected route
  req.user = currentUser;
  next();
};

//restrcting deleting tour to certain user authorization

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to do that action ", 403)
      );
    }
    next();
  };
};
