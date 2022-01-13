const tourController = require("../controllers /tourController");
const authController = require("../controllers /authController");
const router = require("express").Router();
const catchAsync = require("../utils /catchAsync");
const reviewRoutes = require("../routes /reviewRoute");

router
  .route("/")
  .get(authController.protectMiddleware, catchAsync(tourController.getAllTours))
  .post(catchAsync(tourController.createTour));

router.route("/tour-stats").get(catchAsync(tourController.getTourStats));

router
  .route("/getMonthlyPlan/:year")
  .get(catchAsync(tourController.getTourStats));

router
  .route("/:id")
  .get(catchAsync(tourController.getTour))
  .patch(catchAsync(tourController.updateTour))
  .delete(
    authController.protectMiddleware,
    authController.restrictTo("admin", "lead-guide"),
    catchAsync(tourController.deleteTour)
  );

//Reviews route for tour

router.use("/:tourId/reviews", reviewRoutes);

// router
//   .route("/tours/:tourId/reviews")
//   .post(
//     authController.protectMiddleware,
//     authController.restrictTo("user"),
//     reviewController.createReview
//   );

module.exports = router;
