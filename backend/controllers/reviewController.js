const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appError.js");
const Reviews = require("../models/reviewModel");

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Reviews.find();
  const stats = await Reviews.calcAverageRatings();
  res.status(200).json({
    status: "success",
    restult: reviews.length,
    reviews,
    stats,
  });
});

exports.createReviews = catchAsync(async (req, res, next) => {
  let data = req.body;
  data.user = req.user._id;
  const newReview = await Reviews.create(req.body);

  res.status(201).json({
    status: "success",
    review: newReview,
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  console.log(req.params.id)
  await Reviews.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
  });
});
