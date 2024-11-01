// review // rating // createdAt // ref to user //
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty!"],
    },
    rating: {
      type: Number,
      required: true,
      max: 5,
      min: 1,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "username",
  });
  next();
});

// This is no a middleware this is statics method
reviewSchema.statics.calcAverageRatings = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  console.log(stats);
  if (stats.length > 0) {
    return {
      nRating: stats[0].nRating,
      avgRating: Math.round(stats[0].avgRating * 10) / 10,
    };
  } else {
    return {
      nRating: 0,
      avgRating: 0,
    };
  }
};

// reviewSchema.index({ user: 1 }, { unique: true });

// reviewSchema.post("save", function () {
//   //here no need to call the next middle were because of post hook
//   this.constructor.calcAverageRatings();
// });

const Reviews = mongoose.model("Reviews", reviewSchema);
module.exports = Reviews;
