const Tour = require("../model/tourModel");
const APIFeatures = require("../utils /apiFeatures");

function tourController() {
  return {
    // async topTours(req, res) {
    //   req.query.limit = "5";
    //   req.query.sort = "-ratingsAverage,price";
    //   req.query.fields = "name,price,ratingsAverage,summary,difficulty";
    // },
    async getTour(req, res) {
      try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
          status: "success",
          data: {
            tour,
          },
        });
      } catch (e) {
        res.status(400).json({
          status: "fail",
          message: e,
        });
      }
    },
    async createTour(req, res) {
      try {
        const newTour = await Tour.create(req.body);
        res.status(200).json({
          status: "success",
          data: {
            tour: newTour,
          },
        });
      } catch (e) {
        res.status(400).json({
          status: "fail",
          message: e,
        });
      }
    },
    async getAllTours(req, res) {
      try {
        const features = new APIFeatures(Tour.find(), req.query)
          .filter()
          .limitFields()
          .sort()
          .paginate();
        const tours = await features.query;
        res.status(200).json({
          status: "success",

          data: {
            result: tours.length,
            tours,
          },
        });
      } catch (e) {
        res.status(400).json({
          status: "fail",
          message: e,
        });
      }
    },
    deleteTour(req, res) {
      try {
        Tour.findById(req.params.id).remove().exec();
        res.status(200).json({
          data: null,
          message: "Deleted Succefully",
        });
      } catch (e) {
        res.status(400).json({
          status: "fail",
          message: e,
        });
      }
    },
    async updateTour(req, res) {
      try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        res.status(200).json({
          status: "success",
          data: {
            tour,
          },
        });
      } catch (e) {
        res.status(400).json({
          status: "fail",
          message: e,
        });
      }
    },
  };
}

module.exports = tourController;
