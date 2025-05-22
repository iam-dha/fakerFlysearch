const express = require("express");
const multer = require("multer");
//Controller
const controller = require("../../controllers/admin/promotion.controller");
//Middleware
const authMiddleware = require("../../middlewares/authenticate.middleware");
const validateMiddleware = require("../../middlewares/validate.middleware")
const uploadCloud = require("../../middlewares/uploadCloud.middleware");
const router = express.Router();
//Schemas
const { promotionSchema } = require("../../schemas/admin/promotion.schema");

//Upload image
const fileUpload = multer();

router.get(
    "/",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["READ_PROMOTION"]),
    controller.getAllPromotions
);

router.post(
    "/",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["CREATE_PROMOTION"]),
    fileUpload.single("thumbnail"),
    uploadCloud.upload,
    validateMiddleware.validateInput(promotionSchema),
    controller.createPromotion
);

module.exports = router;
