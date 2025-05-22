const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/busCompany.controller");
const { checkAccessToken } = require("../../middlewares/authenticate.middleware");
const { validateInput } = require("../../middlewares/validate.middleware");
const { createOrUpdateSchema } = require("../../schemas/admin/busCompany.schema");

router.use(checkAccessToken("Admin"));

router.get("/", controller.getAll);
router.post("/", validateInput(createOrUpdateSchema), controller.create);
router.get("/:id", controller.getById);
router.patch("/:id", validateInput(createOrUpdateSchema), controller.update);
router.delete("/:id", controller.softDelete);

module.exports = router;