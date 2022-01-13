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

exports.createReview = async (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const createdReview = await Review.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      review: createdReview,
    },
  });
};

exports.deleteReview = factoryFunction.deleteOne(Review);
