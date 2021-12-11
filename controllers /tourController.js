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
    getAllTours(req, res) {
      try {
        const tours = Tour.find();
        res.status(200).json({
          status: "success",
          data: {
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
  };
}

module.exports = tourController;
