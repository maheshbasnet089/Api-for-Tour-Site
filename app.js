const express = require("express");
const app = express();
const morgan = require("morgan");
const initRoute = require("./routes /tourRoute");
const router = require("./routes /tourRoute");
if (process.env.NODE_ENV == "developement") {
  app.use(morgan("tiny"));
}

initRoute(app);
app.use("/api/v1", router);
module.exports = app;
