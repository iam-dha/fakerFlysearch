const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/hotel.controller");
const { validateInput } = require("../../middlewares/validate.middleware");
const { checkAccessToken } = require("../../middlewares/authenticate.middleware");
const {
  bookHotelSchema,
  getRoomsByIataAndDateSchema,
  getHotelListSchema,
  getRoomsByHotelIdSchema
} = require("../../schemas/hotel.schema");


router.post(
  "/hotel-bookings",
  checkAccessToken("User"),
  validateInput(bookHotelSchema),
  controller.bookMultipleRooms
);

router.get(
  "/hotel-rooms",
  checkAccessToken("User"),
  validateInput(getRoomsByIataAndDateSchema, "query"),
  controller.getRoomsByIataAndDate
);

router.get(
  "/hotels",
  checkAccessToken("User"),
  validateInput(getHotelListSchema, "query"),
  controller.getHotelList
);

router.get("/hotels/:hotelId/rooms",
  checkAccessToken("User"),
  validateInput(getRoomsByHotelIdSchema, "query"),
   controller.getRoomsByHotelId);
// /api/v1/hotels/664f29d1a914e95e7d10c5be/rooms?type=deluxe&page=2&limit=5

router.get("/iata/:iata", controller.getHotelsByIata);


module.exports = router;