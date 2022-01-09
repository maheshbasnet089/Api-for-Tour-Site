const { promisify } = require("util");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils /appError");
const sendEmail = require("../utils /email");
const { createHash } = require("crypto");

const signInToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createToken = (user, statusCode, res) => {
  const token = signInToken(user._id);
  res.status(statusCode).json({
    status: "sucess",
    token,
    data: {
      user,
    },
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

  createToken(newUser, 201, res);
  // //jsonwebtoken signin
  // const token = signInToken(newUser._id);
  // // console.log(token);
  // res.status(201).json({
  //   status: "success",
  //   token,
  //   data: {
  //     user: newUser,
  //   },
  // });
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

  createToken(user, 201, res);
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

exports.forgotPassword = async (req, res, next) => {
  //1) check if email exists in DB
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("The email doesnot exists", 404));
  }
  //create reset Token
  const resetToken = user.createResetToken();

  await user.save({ validateBeforeSave: false });

  //send email
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password ? Submit a patch request with your new password and password confirm to 
  :${resetUrl}. \n If you don't forget your password , please ignore this email! `;

  // await sendEmail({
  //   email: user.email,
  //   subject: "Your password reset token (only valid for 10 minutes)",
  //   message,
  // });
  // res.status(200).json({
  //   status: "success",
  //   message: "Email sent succesfully",
  // });
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (only valid for 10 minutes)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Email sent succesfully",
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "The email cannot be send due to some internal issue! Please try again later",
        500
      )
    );
  }
};

exports.resetPassword = async (req, res, next) => {
  const notHashedToken = req.params.token;
  const hashedToken = createHash("sha256").update(notHashedToken).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiresIn: { $gt: Date.now() },
  });
  //if token is not valiad or expired
  if (!user) {
    return next(new AppError("Invalid token or token is expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetTokenExpiresIn = undefined;
  user.passwordResetToken = undefined;
  await user.save();

  //sign in jwt token
  createToken(user, 201, res);
};

exports.updatePassword = async (req, res, next) => {
  //find user
  const user = await User.findById(req.user._id).select("+password");
  //check if currentEntered Password matches DB password
  if (!(await user.comparePasswords(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Please enter correct current Password", 401));
  }
  //if password matches then update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // we do .save() but not findBYIDAndupdate because there is no validation in findbyidandupdate and presave hooks does not come inton action
  createToken(user, 200, res);
};
