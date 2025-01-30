const express = require("express");
const router = express.Router();
const {
  updateBooking,
  createBooking,
  getCheckoutSession,
  deleteBooking,
  getBooking,
  getAllBookings,
  getsUserBooking,
} = require("../controllers/bookingController");
const isLoggedin = require("../middleware/isLoggedin");
router.get(
  "/checkout-session/:userId",
  // isLoggedin,
  getCheckoutSession
);
router.route("/").post(createBooking).get(getAllBookings);
router.route("/:id").delete(deleteBooking).get(getBooking).patch(updateBooking);
router.route("/user/:userId").get(getsUserBooking);
module.exports = router;
