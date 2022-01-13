const Review = require("../model/reviewModel");
const factoryFunction = require("../controllers /handlerFactory");

exports.setReviewIds = (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factoryFunction.getAll(Review);
exports.getReview = factoryFunction.getOne(Review);

exports.createReview = factoryFunction.createOne(Review);
exports.updateReview = factoryFunction.updateOne(Review);

exports.deleteReview = factoryFunction.deleteOne(Review);
