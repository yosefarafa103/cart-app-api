const express = require("express");
const router = express.Router();
const {
  getRootPage,
  getUsers,
  getUserData,
  getSessionCheckOutPage,
} = require("../controllers/viewController");
const { handelLogin } = require("../controllers/loginController");
const { createBookingCheckout } = require("../controllers/bookingController");
router.get("/", createBookingCheckout, getRootPage);
router.get("/users-page", getUsers);
router.get("/user/:id", getUserData);
router.get("/login", handelLogin);
// router.get("/booking/checkout-session/:userId", getSessionCheckOutPage);
// getSessionCheckOutPage
module.exports = router;
