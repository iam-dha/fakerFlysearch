const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/flight.controller");
const authMiddleWare = require("../../middlewares/authenticate.middleware");
const  { validateInput } = require("../../middlewares/validate.middleware");
const { searchFlightSchema } = require("../../schemas/flight.schema");
const { fullsearchQuerySchema, confirmPriceSchema } = require("../../schemas/flight.schema");
const { parseFullsearchParams } = require("../../middlewares/parseFullsearch.middleware");

router.get(
  "/search",
  validateInput(searchFlightSchema, "query"),
  //authMiddleWare.checkAccessToken(),
  controller.searchAndStoreFlights
); // /api/v1/flights/search?from=SGN&to=HAN&date=2024-06-02

router.post(
  "/confirm-price",
  validateInput(confirmPriceSchema),
  //authMiddleWare.checkAccessToken(),
  controller.confirmFlightPrice
);  // /api/v1/flights/confirm-price


router.get(
  "/fullsearch",
  validateInput(fullsearchQuerySchema, "query"),
  //authMiddleWare.checkAccessToken(),
  parseFullsearchParams,
  controller.fullSearchHandler
);


module.exports = router;