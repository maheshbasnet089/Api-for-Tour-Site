const express = require("express");
const app = express();
const morgan = require("morgan");
const router = require("./routes /tourRoute");
const AppError = require("./utils /appError");
const globalErrorHandler = require("./controllers /errorController");

if (process.env.NODE_ENV == "developement") {
  app.use(morgan("tiny"));
}

app.use(express.json());

app.use("/api/v1/tours", router);

app.all("*", (req, res, next) => {
  // const err = new Error(`Cannot find path ${req.originalUrl} `);
  // err.status = "fail";
  // err.statusCode = 404;
  next(new AppError(`Cannot find path ${req.originalUrl} `, 404));
});

app.use(globalErrorHandler);
module.exports = app;

//git rm -r --cached node_modules
