const express = require("express");
const {
  getAllReviews,
  createReviews,
  reviewInfo,
} = require("../controllers/reviewController");
const { product } = require("../controllers/authController");

const router = express.Router();

router.route("/").get(product, getAllReviews).post(product, createReviews);

module.exports = router;
