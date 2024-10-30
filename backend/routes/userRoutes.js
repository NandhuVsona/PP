const express = require("express");
const {
  signup,
  checkId,
  logIn,
  product,
  forgotPassword,
  resetPassword,
  updatePassword,
  tempUser,
} = require("../controllers/authController");
const {
  getall,
  getUser,
  deleteUser,
  updateMe,
  deleteMe,
} = require("../controllers/userController");
const {
  getAllAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} = require("../controllers/accountController");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getAccountsAndCategories,
  homeUpdate,
} = require("../controllers/categoryController");
const {
  getBudgets,
  setBudget,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");
const {
  createTransaction,
  getAllTransactions,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
const router = express.Router();

//MIDDLEWARE
router.route("/accounts/:id").get(product, getAllAccounts).post(createAccount); //Here id is user id
router.route("/accounts/:id").patch(updateAccount).delete(deleteAccount); //Here id is account id

// router.param("id", checkId);
router.post("/signup", signup);
router.post("/login", logIn);
router.get("/users", getall);

//FORGOT PASSWORD
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updateMyPassword", product, updatePassword);
router.patch("/updateMe", product, updateMe);
router.delete("/deleteMe", product, deleteMe);

router.route("/:id").get(getUser).delete(deleteUser);



//CATEGORY ROUTES
router
  .route("/categories/:id")
  .get(getAllCategories)
  .post(createCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

//BUDGET ROUTES
router
  .route("/budgets/:id")
  .get(getBudgets)
  .post(setBudget)
  .patch(updateBudget)
  .delete(deleteBudget);

//TRANSACTIONS ROUTES
router
  .route("/transactions/:id")
  .get(getAllTransactions)
  .post(createTransaction)
  .patch(updateTransaction)
  .delete(deleteTransaction);

router.get("/data/:id", getAccountsAndCategories);
router.patch("/budgets/some/:id", homeUpdate);
module.exports = router;
