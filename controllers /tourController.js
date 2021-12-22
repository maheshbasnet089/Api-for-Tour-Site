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
      const tour = await Tour.findById(req.params.id);
      res.status(200).json({
        status: "success",
        data: {
          tour,
        },
      });
    },
    async createTour(req, res) {
      const newTour = await Tour.create(req.body);
      res.status(200).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    },
    async getAllTours(req, res) {
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
    },
    async getTourStats(req, res) {
      const stats = await Tour.aggregate([
        {
          $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
          $group: {
            _id: { $toUpper: "$difficulty" },
            numTours: { $sum: 1 },
            numRatings: { $sum: "$ratingsQuantity" },
            avgRating: { $avg: "$ratingsAverage" },
            avgPrice: { $avg: "$price" },
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
          },
        },
        {
          $sort: { avgPrice: 1 },
        },
        // {
        //   $match: { _id: { $ne: 'EASY' } }
        // }
      ]);

      res.status(200).json({
        status: "success",
        data: {
          stats,
        },
      });
    },
    async getMonthlyPlan(req, res) {
      const year = req.params.year * 1; // 2021

      const plan = await Tour.aggregate([
        {
          $unwind: "$startDates",
        },
        {
          $match: {
            startDates: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$startDates" },
            numTourStarts: { $sum: 1 },
            tours: { $push: "$name" },
          },
        },
        {
          $addFields: { month: "$_id" },
        },
        {
          $project: {
            _id: 0,
          },
        },
        {
          $sort: { numTourStarts: -1 },
        },
        {
          $limit: 12,
        },
      ]);

      res.status(200).json({
        status: "success",
        data: {
          plan,
        },
      });
    },
  };
}

module.exports = tourController;
