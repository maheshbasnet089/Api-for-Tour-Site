const tourController = require("../controllers /tourController");
const router = require("express").Router();

router.get("/", tourController().getAllTours);
router.get("/tour-stats", tourController().getTourStats);
router.get("/getMonthlyPlan/:year", tourController().getTourStats);

router.get("/tours/:id", tourController().getTour);

router.post("/", tourController().createTour);
router.get("/delete/:id", tourController().deleteTour);
router.patch("/update/:id", tourController().updateTour);
// router.get("/tours/topTours", tourController().topTours);

module.exports = router;
