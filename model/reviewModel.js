const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  review: {
    type: String,
    required: [true, "Review cannot be empty"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  tour: {
    type: Schema.Types.ObjectId,
    ref: "Tour",
    required: [true, "A  review must belong to a tour "],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, " A review must belongs to a user"],
  },
});

//query middleware => this refers to the query

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: "tour",
  //   select: " name",
  // }).populate({
  //   path: "user",
  //   select: "name photo",
  // });

  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

module.exports = mongoose.model("Review", reviewSchema);
