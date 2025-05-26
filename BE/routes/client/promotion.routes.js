const express = require("express");
const controller = require("../../controllers/client/promotion.controller");

const authMiddleWare = require("../../middlewares/authenticate.middleware");
const router = express.Router();

router.get("/", 
    authMiddleWare.checkAccessToken("User"),
    controller.getAllPromotions
);

module.exports = router;