const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/car.controller");
const authMiddleWare = require("../../middlewares/authenticate.middleware");
const { validateInput } = require("../../middlewares/validate.middleware");
const { bookCarSchema, getAvailableCarsSchema } = require("../../schemas/car.schema");
const { checkAccessToken } = require("../../middlewares/authenticate.middleware");

router.get(
  "/car-routes",
  validateInput(getAvailableCarsSchema),
  controller.getAvailableCars
);

router.post(
  "/car-bookings",
  authMiddleWare.checkAccessToken("User"),
  validateInput(bookCarSchema),
  controller.bookCar
);

module.exports = router;
