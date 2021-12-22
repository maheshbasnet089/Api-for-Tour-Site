const tourController = require("../controllers /tourController");
const router = require("express").Router();
const catchAsync = require("../utils /catchAsync");

router.get("/", catchAsync(tourController().getAllTours));
router.get("/tour-stats", catchAsync(tourController().getTourStats));
router.get("/getMonthlyPlan/:year", catchAsync(tourController().getTourStats));

router.get("/:id", catchAsync(tourController().getTour));

router.post("/", catchAsync(tourController().createTour));
router.get("/delete/:id", tourController().deleteTour);
router.patch("/update/:id", catchAsync(tourController().updateTour));
// router.get("/tours/topTours", tourController().topTours);

module.exports = router;
