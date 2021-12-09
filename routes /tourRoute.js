const tourController = require("../controllers /tourController");

function initRoute(app) {
  app.get("/", tourController().getTour);
}

module.exports = initRoute;
