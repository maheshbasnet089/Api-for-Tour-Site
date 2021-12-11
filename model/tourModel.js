const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");

const tourSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have name "],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal to 40 characters "],
      minlength: [10, " A tour name must be atleast 10 character"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have duration "],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have difficulty level"],
      enum: {
        values: ["easy", "medium", "hard"],
        message: "Difficult should be either easy, medium or hard",
      },
      default: "medium",
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Tour rating must be greater or equal to 1"],
      max: [5, "Tour rating must be less than 5 "],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Tour must have price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) less than actual price",
      },
      summary: {
        type: String,
        trim: String,
        required: [true, "A tour must have summary"],
      },
      description: {
        type: String,
        trim: true,
      },
      imageCover: {
        type: String,
        required: [true, "A tour must have a cover image"],
      },
      images: [String],
      createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
      },
      startDates: [Date],
      secretTour: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//with get virtual method ,  existing document field => new document field but not saved on DB
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//Document middleware, runs before .save() and .create()

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//query middleware
tourSchema.pre("find", function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
