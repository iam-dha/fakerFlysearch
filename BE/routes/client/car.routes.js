const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/car.controller");
const { validateInput } = require("../../middlewares/validate.middleware");
const { bookCarSchema, getAvailableCarsSchema } = require("../../schemas/car.schema");

router.get(
  "/car-routes",
  validateInput(getAvailableCarsSchema, "query"),
  controller.getAvailableCars
);

router.post(
  "/car-bookings",
  checkAccessToken("User"),
  validateInput(bookCarSchema),
  controller.bookCar
);

module.exports = router;
