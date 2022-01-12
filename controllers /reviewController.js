const Review = require("../model/reviewModel");

exports.getAllReviews = async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: "success",
    lenth: reviews.length,
    data: {
      reviews,
    },
  });
};

exports.createReview = async (req, res, next) => {
  const createdReview = await Review.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      review: createdReview,
    },
  });
};
