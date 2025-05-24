const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/flight.controller");
const  { validateInput } = require("../../middlewares/validate.middleware");
const { searchFlightSchema } = require("../../schemas/flight.schema");
const { fullsearchQuerySchema, confirmPriceSchema } = require("../../schemas/flight.schema");
const { parseFullsearchParams } = require("../../middlewares/parseFullsearch.middleware");

router.get(
  "/search",
  validateInput(searchFlightSchema, "query"),
  controller.searchAndStoreFlights
); // /api/v1/flights/search?from=SGN&to=HAN&date=2024-06-02

router.post(
  "/confirm-price",
  validateInput(confirmPriceSchema),
  controller.confirmFlightPrice
);  // /api/v1/flights/confirm-price


router.get(
  "/fullsearch",
  validateInput(fullsearchQuerySchema, "query"),
  parseFullsearchParams,
  controller.fullSearchHandler
);


module.exports = router;