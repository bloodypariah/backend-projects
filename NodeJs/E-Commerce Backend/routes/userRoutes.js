const express = require("express");

const userControllers = require("../controllers/userControllers.js");

// Router
const router = express.Router();
const auth = require("../auth.js");
const { verify, verifyAdmin } = auth;

// Routes
// Check if email already exists
router.get("/checkEmail", userControllers.checkEmailExists);

// User registration
router.post(
  "/register",
  userControllers.checkEmailExists,
  userControllers.registerUser,
);

// Authenticating user
router.post("/well-met", userControllers.loginUser);

// Order Checkout (Verified but non admin user)
router.post("/procure-items", verify, userControllers.createOrder);

// Retrieve User details
router.post("/character-sheet", verify, userControllers.getUserDetails);

// Set User as Admin
router.put("/lordship", verify, verifyAdmin, userControllers.updateAsAdmin);

// Get authenticated user's orders
router.get("/:userId/display-the-haul", verify, userControllers.displayOrders);

// Display all the orders. Admin only
router.get(
  "/ledger-shredder",
  verify,
  verifyAdmin,
  userControllers.displayAllOrders,
);

module.exports = router;
