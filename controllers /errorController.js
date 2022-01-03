const AppError = require("../utils /appError");
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

// const handleDuplicateFieldErrorDB = (err) => {
//   const value = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0];
//   // console.log(value);
//   const message = `The value ${value} already exists , please use another value `;
//   return new AppError(message, 400);
// };
// const handleValidationErrorDB = (err) => {
//   const errors = Object.values(err.errors).map((el) => el.message);
//   // console.log(errors);
//   const message = `Invalid input data . ${errors.join(". ")}`;
//   // console.log(errors);
//   console.log(message);
//   return new AppError(message, 400);
// };

function sendErrorDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
}

function sendErrorProd(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR ✨", err);
    res.status(500).json({
      status: "error",
      message: "something went very wrong",
    });
  }
}

module.exports = (err, req, res, next) => {
  //   console.log(err.stack);
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // console.log("err", err);

    if (err.name === "CastError") err = handleCastErrorDB(err);
    // erroisOperational = true;
    // if ((err.code = 11000)) err = handleDuplicateFieldErrorDB(err);

    // if ((err.name = "ValidationError")) err = handleValidationErrorDB(err);

    sendErrorProd(err, res);
  }
};
