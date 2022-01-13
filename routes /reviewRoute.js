const router = require("express").Router({ mergeParams: true });
const reviewController = require("../controllers /reviewController");
const authController = require("../controllers /authController");
const catchAsync = require("../utils /catchAsync");

router
  .route("/")
  .get(catchAsync(reviewController.getAllReviews))
  .post(
    authController.protectMiddleware,
    authController.restrictTo("user"),
    reviewController.setReviewIds,
    catchAsync(reviewController.createReview)
  );

router
  .route("/:id")
  .get(catchAsync(reviewController.getReview))
  .delete(reviewController.deleteReview)
  .patch(catchAsync(reviewController.updateReview));

module.exports = router;
