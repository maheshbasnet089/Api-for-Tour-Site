const express = require("express");
const app = express();
const morgan = require("morgan");
const router = require("./routes /tourRoute");

if (process.env.NODE_ENV == "developement") {
  app.use(morgan("tiny"));
}

app.use(express.json());

app.use("/api/v1", router);
module.exports = app;
