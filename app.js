const express = require("express");
const app = express();
const morgan = require("morgan");
const router = require("./routes /tourRoute");

if (process.env.NODE_ENV == "developement") {
  app.use(morgan("tiny"));
}

app.use(express.json());

app.use("/api/v1/tours", router);

app.all("*", (req, res, next) => {
  const err = new Error(`Cannot find path ${req.originalUrl} `);
  err.status = "fail";
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
module.exports = app;

//git rm -r --cached node_modules
