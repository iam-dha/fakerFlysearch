const experss = require("express");

//Controller
const controller = require("../../controllers/admin/role.controller");
const router = experss.Router();
// Middleware
const authMiddleware = require("../../middlewares/authenticate.middleware");

router.get("/",authMiddleware.checkAccessToken("Admin"), authMiddleware.checkPermission(['ACCESS_CONTROL_ADMIN']),controller.getAllRoles);
router.get("/permissions", authMiddleware.checkAccessToken("Admin"), authMiddleware.checkPermission(['ACCESS_CONTROL_ADMIN']),controller.getAllPermissions);
router.get("/test", controller.test);
module.exports = router;