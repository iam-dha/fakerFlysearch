const express = require("express");
const router = express.Router();
const controller = require("../../controllers/flight/flight.controller");
const authMiddleware = require("../../middlewares/authenticate.middleware");
const { updateMarketingFieldsValidator, updatePromotionsValidator } = require("../../validators/flight.validator");

router.get(
  "/",
  authMiddleware.checkAccessToken("Admin"),
  controller.getAllFlights
);
router.patch(
  "/:id",
  authMiddleware.checkAccessToken("Admin"),
  validateMiddleware.validateInput(updateMarketingFieldsValidator),
  controller.updateMarketingFields
);

router.patch(
  "/:id/promotions",
  authMiddleware.checkAccessToken("Admin"),
  validateMiddleware.validateInput(updatePromotionsValidator),
  controller.updatePromotions
);

module.exports = router;
