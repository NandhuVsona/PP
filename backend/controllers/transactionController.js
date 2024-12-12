const { Transactions } = require("../models/transactionModel");
const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { generateReport } = require("../utils/report");
const { Budgets } = require("../models/budgetModel");

exports.getAllTransactions = catchAsync(async (req, res, next) => {
  const { month } = req.query;

  const allTransaction = await Transactions.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(req.user._id),
        month,
      },
    },

    {
      $lookup: {
        from: "categories", // The collection name for categories
        localField: "category", // Field from the Transactions collection
        foreignField: "_id", // Field from the Categories collection
        as: "categoryDetails", // The name of the field to store the joined category
      },
    },
    {
      $lookup: {
        from: "accounts", // The collection name for accounts
        localField: "account", // Field from the Transactions collection
        foreignField: "_id", // Field from the Accounts collection
        as: "accountDetails", // The name of the field to store the joined account
      },
    },
    {
      $lookup: {
        from: "accounts", // The collection name for accounts
        localField: "toAccount", // Field from the Transactions collection
        foreignField: "_id", // Field from the Accounts collection
        as: "toAccount", // The name of the field to store the joined account
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },

    {
      $group: {
        _id: "$date", // Group by `date`
        transactions: {
          $push: {
            _id: "$_id",
            category: "$categoryDetails",
            account: "$accountDetails",
            amount: "$amount",
            description: "$description",
            month: "$month",
            userId: "$userId",
            type: "$type",
            toAccount: "$toAccount",
            time: "$time",
            createdAt: "$createdAt",
          },
        },
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: allTransaction,
  });
});
exports.createTransaction = catchAsync(async (req, res, next) => {
  let data = req.body;
  console.log(data);
  if (data.type === "expense") {
    let budget = await Budgets.findOne({
      month: data.month,
      userId: req.user._id,
      categoryId: data.category,
    });
    if (budget) {
      budget.spend += data.amount;
      await budget.save();
    }
  }

  data.userId = req.user._id;
  let newTransaction = await Transactions.create(data);
  res.status(201).json({
    newTransaction,
  });
});

exports.updateTransaction = catchAsync(async (req, res, next) => {
  let oldOne = await Transactions.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  console.log(oldOne.category + "====" + req.body.categoryId);
  console.log(oldOne.category == req.body.categoryId);
  if (oldOne.category == req.body.categoryId) {
    console.log("Old one amount: ", oldOne.amount);
    console.log("Updated one amount: ", req.body.amount);
    let budget = await Budgets.findOne({
      userId: req.user._id,
      categoryId: oldOne.category,
    });
    console.log(budget);
    console.log("here the update one");
    if (budget) {
      budget.spend -= oldOne.amount;
      budget.spend += req.body.amount;
      console.log(budget);
      await budget.save();
    }
  } else {
    console.log("category is changed;");
    let budget = await Budgets.findOne({
      userId: req.user._id,
      categoryId: oldOne.category,
    });
    console.log("this is now");
    console.log(budget);
    if (budget) {
      budget.spend -= oldOne.amount;
      await budget.save();
      console.log(budget);
    }
    const newnnn = await Budgets.findOne({
      userId: req.user._id,
      categoryId: req.body.categoryId,
    });
    console.log(newnnn);
    if (newnnn) {
      newnnn.spend += req.body.amount;
      await newnnn.save();
      console.log(newnnn);
    }
  }

  // return;
  // if (data.type === "expense") {
  //   let budget = await Budgets.findOne({
  //     month: data.month,
  //     userId: req.user._id,
  //     categoryId: data.category,
  //   });
  //   if (budget) {
  //     budget.spend += data.amount;
  //     await budget.save();
  //   }
  // }
  // let updatedTransaction = await Transactions.findByIdAndUpdate(
  //   req.params.id,
  //   req.body,
  //   { new: true }
  // );
  // if (!updatedTransaction) {
  //   return next(new AppError("Invalid ID", 404));
  // }
  res.status(200).json({
    // updatedTransaction,
  });
});

exports.deleteTransaction = catchAsync(async (req, res, next) => {
  let delTransaction = await Transactions.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  let budget = await Budgets.findOne({
    userId: req.user._id,
    categoryId: delTransaction.category,
  });

  if (budget) {
    budget.spend -= delTransaction.amount;
    await budget.save();
  }

  await Transactions.deleteOne({ _id: req.params.id });
  res.status(204).json({});
});

exports.records = catchAsync(async (req, res, next) => {
  let month = req.query.month;
  let userId = req.user._id;
  let data = await Transactions.aggregate([
    { $match: { month, userId } },
    {
      $lookup: {
        from: "accounts",
        localField: "account",
        foreignField: "_id",
        as: "accountInfo",
      },
    },
    { $unwind: { path: "$accountInfo", preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
  ]);

  generateReport(data, res);
});
