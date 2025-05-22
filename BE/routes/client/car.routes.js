const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/car.controller");

router.get("/car-routes", controller.getAvailableCars);
router.post("/car-bookings", controller.bookCar);

module.exports = router;
