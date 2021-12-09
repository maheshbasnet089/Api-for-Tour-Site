const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoConnection = require("./controllers /db");
if (process.env.NODE_ENV == "developement") {
  app.use(morgan("tiny"));
}

mongoConnection(process.env.MONGO_URI);
module.exports = app;
