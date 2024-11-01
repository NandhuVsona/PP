const { Categories } = require("../models/categoryModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const { Accounts } = require("../models/accountModel");
const { Transactions } = require("../models/transactionModel");
const { Budgets } = require("../models/budgetModel");

exports.getAllCategories = catchAsync(async (req, res, next) => {
  let categories = await Categories.find({ userId: req.user._id });

  if (!categories) {
    return next(new AppError("Categories not found", 404));
  }

  res.status(200).json({
    status: "success",
    result: categories.length,
    data: categories,
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  let newCategory = await Categories.create({
    image: req.body.image,
    name: req.body.name,
    type: req.body.type,
    userId: req.user._id,
  });

  // Respond with the newly created category
  res.status(201).json({
    status: "success",
    data: newCategory,
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Categories.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: category,
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  let { userId } = req.user._id;
  let categoryId = req.params.id;

  const transactions = await Transactions.deleteMany({
    userId,
    category: categoryId,
  });

  const budgeted = await Budgets.deleteMany({ userId, categoryId });
  const category = await Categories.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
  });
});

//for income expense and account
exports.getAccountsAndCategories = catchAsync(async (req, res, next) => {
  let categories = await Categories.find({ userId: req.user._id });
  let accounts = await Accounts.find({ userId: req.user._id });

  if (!categories) {
    return next(new AppError("Categories not found", 404));
  }

  const categorized = categories.reduce(
    (acc, item) => {
      if (item.type === "income") acc.income.push(item);
      if (item.type === "expense") acc.expense.push(item);
      return acc;
    },
    { income: [], expense: [] }
  );

  res.status(200).json({
    status: "success",
    incomeCategories: categorized.income,
    expenseCategories: categorized.expense,
    accounts,
  });
});


exports.homeUpdate = catchAsync(async (req,res,next)=>{
  const {categoryId} = req.query;
  const userId  = req.params.id;
  let budgeted = await Budgets.findOneAndUpdate(
    { userId, categoryId },    
    req.body,
    { new: true }              
  );
  res.status(200).json({
    status:"success",
    budgeted
  })
})
