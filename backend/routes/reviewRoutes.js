const express = require("express");
const {
  getAllReviews,
  createReviews,
  deleteReview,
} = require("../controllers/reviewController");
const { product } = require("../controllers/authController");

const router = express.Router();

router.route("/").get( getAllReviews).post( createReviews)

router.route("/:id").delete(deleteReview);

module.exports = router;
