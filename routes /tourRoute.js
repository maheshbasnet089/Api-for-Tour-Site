const tourController = require("../controllers /tourController");
const authController = require("../controllers /authController");
const router = require("express").Router();
const catchAsync = require("../utils /catchAsync");
const userController = require("../controllers /userController");

router.post("/users/signup", catchAsync(authController.signUp));
router.post("/users/login", catchAsync(authController.logIn));

router.get("/tours/", catchAsync(tourController().getAllTours));
router.get("/tours/tour-stats", catchAsync(tourController().getTourStats));
router.get(
  "/tours/getMonthlyPlan/:year",
  catchAsync(tourController().getTourStats)
);

router.get("/tours/:id", catchAsync(tourController().getTour));

router.post("/tours/", catchAsync(tourController().createTour));
router.get("/tours/delete/:id", tourController().deleteTour);
router.patch("/tours/update/:id", catchAsync(tourController().updateTour));
// router.get("/tours/topTours", tourController().topTours);

//Users
router.get("/users", userController.getAllUsers);

module.exports = router;
