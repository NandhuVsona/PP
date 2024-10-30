const { Accounts } = require("../models/accountModel");
const catchAsync = require("../utils/catchAsync");

exports.createAccount = catchAsync(async (req, res, next) => {
  const newAccount = await Accounts.create({
    icon: req.body.icon,
    accountName: req.body.accountName,
    balance: req.body.balance,
    userId:req.params.id
  });
  res.status(201).json({
    status: "success",
    data: newAccount,
  });
});

exports.getAllAccounts = catchAsync(async (req, res, next) => {
  const accounts = await Accounts.find({userId:req.params.id});
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
