const authController = require("../controllers /authController");
const router = require("express").Router();
const catchAsync = require("../utils /catchAsync");
const userController = require("../controllers /userController");

router.route("/signup").post(catchAsync(authController.signUp));
router.route("/login").post(catchAsync(authController.logIn));
router.route("/forgotPassword").post(catchAsync(authController.forgotPassword));
router
  .route("/resetPassword/:token")
  .patch(catchAsync(authController.resetPassword));

router.use(authController.protectMiddleware);

router
  .route("/updateMyPassword")
  .patch(catchAsync(authController.updatePassword));

router.route("/updateMe").patch(catchAsync(userController.updateMe));

router.route("/deleteMe").delete(catchAsync(userController.deleteMe));
router.route("/me").get(userController.getMe, userController.getUser);

// runs on every request after this middleware
router.use(authController.restrictTo("admin"));

router.route("/").get(catchAsync(userController.getAllUsers));

router
  .route("/:id")
  .get(catchAsync(userController.getUser))
  .delete(userController.deleteUser)
  .patch(
    authController.protectMiddleware,
    catchAsync(userController.updateUser)
  );

module.exports = router;
