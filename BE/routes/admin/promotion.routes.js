const express = require("express");
//Controller
const controller = require("../../controllers/admin/promotion.controller");

//Middleware
const authMiddleware = require("../../middlewares/authenticate.middleware");

const {
  createPromotionValidator,
  updatePromotionValidator,
} = require("../../validators/admin/promotion.validator");

const router = express.Router();

router.get(
  "/",
  authMiddleware.checkAccessToken("Admin"),
  authMiddleware.checkPermission("READ_PROMOTION"),

  controller.getAllPromotions
);

router.post(
  "/",
  authMiddleware.checkAccessToken("Admin"),
  authMiddleware.checkPermission("READ_PROMOTION"),
  validateInput(createPromotionValidator),
  controller.createPromotion
);
router.get(
  "/:id",
  authMiddleware.checkAccessToken("Admin"),
  authMiddleware.checkPermission("READ_PROMOTION"),
  controller.getPromotionById
);
router.patch(
  "/:id",
  authMiddleware.checkAccessToken("Admin"),
  authMiddleware.checkPermission("READ_PROMOTION"),
  validateInput(updatePromotionValidator),
  controller.updatePromotion
);
router.delete(
  "/:id",
  authMiddleware.checkAccessToken("Admin"),
  authMiddleware.checkPermission("READ_PROMOTION"),
  controller.deletePromotion
);

module.exports = router;
