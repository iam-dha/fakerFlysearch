const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/booking.controller");
const { validateInput } = require("../../middlewares/validate.middleware");
const { createBookingValidator } = require("../../schemas/booking.schema");
const { checkAccessToken } = require("../../middlewares/authenticate.middleware");


router.post(
  "/",
  checkAccessToken("User"),
  validateInput(createBookingValidator),
  controller.createBookingFromFullsearch
);

router.get(
  "/history",
  checkAccessToken("User"),
  controller.getUserBookings
);

router.post(
  "/:bookingId/pay",
  checkAccessToken("User"),
  controller.mockPayment
);

router.get(
  "/:bookingId",
  checkAccessToken("User"),
  controller.getBookingById
);

module.exports = router;