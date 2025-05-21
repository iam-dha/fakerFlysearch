const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/hotel.controller");

router.post("/hotel-bookings", controller.bookMultipleRooms);
router.get("/hotel-rooms", controller.getRoomsByIataAndDate);
router.get("/hotels", controller.getHotelList);

module.exports = router;