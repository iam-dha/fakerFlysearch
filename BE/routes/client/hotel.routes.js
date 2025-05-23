const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/hotel.controller");
const { validateInput } = require("../../middlewares/validate.middleware");
const { checkAccessToken } = require("../../middlewares/authenticate.middleware");
const {
  bookHotelSchema,
  getRoomsByIataAndDateSchema,
  getHotelListSchema
} = require("../../schemas/hotel.schema");


router.post(
  "/hotel-bookings",
  checkAccessToken("User"),
  validateInput(bookHotelSchema),
  controller.bookMultipleRooms
);

router.get(
  "/hotel-rooms",
  validateInput(getRoomsByIataAndDateSchema, "query"),
  controller.getRoomsByIataAndDate
);

router.get(
  "/hotels",
  validateInput(getHotelListSchema, "query"),
  controller.getHotelList
);

module.exports = router;