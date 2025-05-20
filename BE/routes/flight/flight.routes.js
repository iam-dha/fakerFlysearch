const express = require("express");
const router = express.Router();
const controller = require("../../controllers/flight/flight.controller");
const validate = require("../../middlewares/validate.middleware");
const { searchFlightSchema } = require("../../validators/flight.validator");
const { fullsearchQuerySchema } = require("../../validators/flight.validator");

router.get(
  "/sync",
  validate(searchFlightSchema, "query"),
  controller.searchAndStoreFlights
); // /api/v1/flights/sync?from=SGN&to=HAN&date=2024-06-02

router.get(
  "/fullsearch",
  validate(fullsearchQuerySchema, "query"),
  parseFullsearchParams,
  controller.fullSearchHandler
);

module.exports = router;