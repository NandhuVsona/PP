const { Budgets } = require("../models/budgetModel");
const { Categories } = require("../models/categoryModel");
const catchAsync = require("../utils/catchAsync");

exports.getBudgets = catchAsync(async (req, res, next) => {
  let userId = req.params.id;
  const budgets = await Budgets.find({
    userId,
    month: "September 2024",
  }).populate("categoryId");

  const userCategoreis = await Categories.find({ userId ,type:'expense'});

  let a = budgets.map((item) => item.categoryId.id);

  let unBudgeted = userCategoreis.filter((item) => !a.includes(item.id));

  res.status(200).json({
    status: "success",
    data: [
      {
        budgeted: budgets,
        unBudgeted,
      },
    ],
  });
});

exports.setBudget = catchAsync(async (req, res, next) => {
  let newBudgets = await Budgets.create(req.body);
  res.status(201).json({
    status: "success",
    data: newBudgets,
  });
});

exports.updateBudget = catchAsync(async (req, res, next) => {
  let update = await Budgets.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({
    status: "success",
    data: update,
  });
});

exports.deleteBudget = catchAsync(async (req, res, next) => {
  let update = await Budgets.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
  });
});
