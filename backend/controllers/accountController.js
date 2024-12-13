const { Accounts } = require("../models/accountModel");
const { Transactions } = require("../models/transactionModel");
const catchAsync = require("../utils/catchAsync");

exports.createAccount = catchAsync(async (req, res, next) => {
  const newAccount = await Accounts.create({
    icon: req.body.icon,
    accountName: req.body.accountName,
    balance: req.body.balance,
    userId: req.user._id,
  });
  res.status(201).json({
    status: "success",
    data: newAccount,
  });
});

exports.getAllAccounts = catchAsync(async (req, res, next) => {
  const accounts = await Accounts.find({ userId: req.user._id });
  res.status(200).json({
    status: "success",
    data: accounts,
  });
});

exports.updateAccount = catchAsync(async (req, res, next) => {
  const updatedAccount = await Accounts.findByIdAndUpdate(
    req.params.id,
    req.body,
    { runValidators: true }
  );
  res.status(200).json({
    status: "success",
    message: "successfully Updated",
    data: updatedAccount,
  });
});

exports.deleteAccount = catchAsync(async (req, res, next) => {
  const accounts = await Accounts.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "sucess",
    message: "successfully deleted.",
  });
});

exports.cumulativeSummary = catchAsync(async (req, res, next) => {
  let summary = await Transactions.aggregate([
    {
      $match: {
        userId: req.user._id,
      },
    },
    {
      $group: {
        _id: "$type",
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $project: {
        type: "$_id",
        totalAmount:1,
        _id:0
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    summary,
  });
});
