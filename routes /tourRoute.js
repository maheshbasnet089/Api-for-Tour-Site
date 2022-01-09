const tourController = require("../controllers /tourController");
const authController = require("../controllers /authController");
const router = require("express").Router();
const catchAsync = require("../utils /catchAsync");
const userController = require("../controllers /userController");

router.post("/users/signup", catchAsync(authController.signUp));
router.post("/users/login", catchAsync(authController.logIn));
router.post("/users/forgotPassword", catchAsync(authController.forgotPassword));
router.patch(
  "/users/resetPassword/:token",
  catchAsync(authController.resetPassword)
);
router.patch(
  "/users/updateMyPassword",
  authController.protectMiddleware,
  catchAsync(authController.updatePassword)
);

router.patch(
  "/users/updateMe",
  authController.protectMiddleware,
  catchAsync(userController.updateMe)
);

router.get(
  "/tours/",

  authController.protectMiddleware,
  catchAsync(tourController().getAllTours)
);
router.get("/tours/tour-stats", catchAsync(tourController().getTourStats));
router.get(
  "/tours/getMonthlyPlan/:year",
  catchAsync(tourController().getTourStats)
);

router.get("/tours/:id", catchAsync(tourController().getTour));

router.post("/tours/", catchAsync(tourController().createTour));
router.get(
  "/tours/delete/:id",
  authController.protectMiddleware,
  authController.restrictTo("admin", "lead-guide"),
  tourController().deleteTour
);
router.patch("/tours/update/:id", catchAsync(tourController().updateTour));
// router.get("/tours/topTours", tourController().topTours);

//Users
router.get("/users", userController.getAllUsers);

router.get("/users/:id", userController.deleteUser);

module.exports = router;
