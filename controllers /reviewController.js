const Review = require("../model/reviewModel");
const factoryFunction = require("../controllers /handlerFactory");

exports.getAllReviews = async (req, res, next) => {
  const filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: "success",
    lenth: reviews.length,
    data: {
      reviews,
    },
  });
};

exports.setReviewIds = (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factoryFunction.createOne(Review);
exports.updateReview = factoryFunction.updateOne(Review);

exports.deleteReview = factoryFunction.deleteOne(Review);
