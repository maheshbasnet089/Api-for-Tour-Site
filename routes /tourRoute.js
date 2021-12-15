const tourController = require("../controllers /tourController");
const router = require("express").Router();

router.get("/tours", tourController().getAllTours);
router.get("/tours/tour-stats", tourController().getTourStats);
router.get("/tours/getMonthlyPlan/:year", tourController().getTourStats);

router.get("/tours/:id", tourController().getTour);

router.post("/tours", tourController().createTour);
router.get("/tours/delete/:id", tourController().deleteTour);
router.patch("/tours/update/:id", tourController().updateTour);
// router.get("/tours/topTours", tourController().topTours);

module.exports = router;
