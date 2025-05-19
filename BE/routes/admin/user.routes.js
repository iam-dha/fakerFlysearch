const express = require('express');
const authMiddleWare = require("../../middlewares/authenticate.middleware");
const controller = require("../../controllers/admin/user.controller");
const router = express.Router();


router.get("/", authMiddleWare.checkAccessToken("Admin"), controller.getAllUserInfo);

router.get("/:userId", authMiddleWare.checkAccessToken("Admin"), authMiddleWare.checkPermission(["users_view"]) , controller.getUserInfo);

router.patch("/:userId", authMiddleWare.checkAccessToken("Admin"), authMiddleWare.checkPermission(["users_edit"]) , controller.changeUserInfo);

module.exports = router;