const tourController = require("../controllers /tourController");

function initRoute(app) {
  app.get("/", tourController().getAllTours);
  app.post("/new", tourController().createTour);
  app.get("/:id", tourController().getTour);
}

module.exports = initRoute;
