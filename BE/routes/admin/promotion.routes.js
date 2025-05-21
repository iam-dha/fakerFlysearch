const express = require("express");
//Controller
const controller = require("../../controllers/admin/promotion.controller");

//Middleware
const authMiddleware = require("../../middlewares/authenticate.middleware");

const router = express.Router();

router.get(
    "/",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission("READ_PROMOTION"),
    controller.getAllPromotions
);

module.exports = router;
