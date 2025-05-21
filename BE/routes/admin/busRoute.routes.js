const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/busRoute.controller");
const { checkAccessToken } = require("../../middlewares/authenticate.middleware");
const { validateInput } = require("../../middlewares/validate.middleware");
const { BusRouteSchema } = require("../../schemas/admin/busRoute.schema");

router.use(checkAccessToken("Admin"));

router.get("/", controller.getAll);
router.post("/", validateInput(BusRouteSchema), controller.create);
router.get("/:id", controller.getById);
router.patch("/:id", validateInput(BusRouteSchema), controller.update);
router.delete("/:id", controller.softDelete);

module.exports = router;