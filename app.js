const express = require("express");
const app = express();
const morgan = require("morgan");
const AppError = require("./utils /appError");
const globalErrorHandler = require("./controllers /errorController");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const expressMongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const reviewRouter = require("./routes /reviewRoute");
const hpp = require("hpp");
const userRouter = require("./routes /userRoute");
const tourRouter = require("./routes /tourRoute.js");

if (process.env.NODE_ENV == "developement") {
  app.use(morgan("tiny"));
}

//set secure http headers or add additional headrers
app.use(helmet());

//limit the rate of requesting the endpoint
const rateLimiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this Ip address . Please try again in later",
});

app.use("/api", rateLimiter);

//Parses the body data in req.body
app.use(express.json({ limit: "10kb" }));

//Data sanitization
app.use(expressMongoSanitize());

//Prevents from xss script
app.use(xss());

//http parameter pollution prevents duplicate parameters
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "price",
      "maxGroupSize",
      "difficulty",
    ],
  })
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);

app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  // const err = new Error(`Cannot find path ${req.originalUrl} `);
  // err.status = "fail";
  // err.statusCode = 404;
  next(new AppError(`Cannot find path ${req.originalUrl} `, 404));
});

app.use(globalErrorHandler);
module.exports = app;

//git rm -r --cached node_modules
