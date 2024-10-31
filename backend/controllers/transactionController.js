const { Transactions } = require("../models/transactionModel");
const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllTransactions = catchAsync(async (req, res, next) => {
  const { month } = req.query;
  console.log(req.user)
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
            type:"$type",
            toAccount:"$toAccount",
            time:"$time"
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
  let newTransaction = await Transactions.create(req.body);
  res.status(201).json({
    newTransaction,
  });
});

exports.updateTransaction = catchAsync(async (req, res, next) => {
  let updatedTransaction = await Transactions.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if(!updatedTransaction){
    return next(new AppError("Invalid ID",404))
  }
  res.status(200).json({
    updatedTransaction,
  });
});

exports.deleteTransaction = catchAsync(async (req, res, next) => {
  let updatedTransaction = await Transactions.findByIdAndDelete(req.params.id);
  res.status(204).json({});
});
