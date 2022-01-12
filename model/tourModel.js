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
      maxlength: [40, "A tour name must have less or equal to 40 characters "], //maxlength only from string
      minlength: [10, " A tour name must be atleast 10 character"],
    },
    secretTour: {
      type: Boolean,
      default: false,
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
        message: "Difficult should be either easy, medium or hard", // In case of error
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
          //this only points to new document created not for updated doc
          return val < this.price;
        },
        message: "Discount price ({VALUE}) less than actual price",
      },
      summary: {
        type: String,
        trim: String, // trims the input .example " Manish" => "Manish"
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
    },
    startLocation: {
      //Geo JSon
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },

      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true }, //while outputing in JSON format , the created virtual property will also be displayed
    toObject: { virtuals: true }, //while output is in Object, the virtual property created will be displayed
  }
);

//with get virtual method ,  existing document field => new document field but not saved on DB
tourSchema.virtual("durationWeeks").get(function () {
  //canot be accesed while querying cause don't store in DB
  return this.duration / 7; //always use regular functin inside mongoose model. cause this keyword is only accesed in those function
});

//virtual populate
tourSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "tour",
});

//Document middleware, runs before .save() and .create()

tourSchema.pre("save", function (next) {
  //function takes only one paramter next
  // console.log(this); // this points to the document that was saved right before actually saved to the DB
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save',function(doc,next){ // post save middleware or hook take two parameter in funcition . Doc=> which is saved
//   console.log(doc)
//   next()
// })

//query middleware
tourSchema.pre(/^find/, function (next) {
  // /^find/ is the regex for finding all the query starting with find eg.: find, findOne
  this.find({ secretTour: { $ne: true } }); // this refers to the query not document
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds ✨`);
  // console.log(docs);
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});

tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
