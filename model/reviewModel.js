const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  review: {
    type: String,
    required: [true, "Review cannot be empty"],
  },
  ratings: {
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

module.exports = mongoose.model("Review", reviewSchema);
