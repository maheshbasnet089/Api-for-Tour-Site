const Tour = require("../model/tourModel");

function tourController() {
  return {
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
        const tours = await Tour.find();
        res.status(200).json({
          status: "success",

          data: {
            result: tours.length,
            tours: tours,
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