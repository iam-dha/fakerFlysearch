const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/busRoute.controller");
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/uploadCloud.middleware");
const {
    checkAccessToken,
    checkPermission,
} = require("../../middlewares/authenticate.middleware");
const { validateInput } = require("../../middlewares/validate.middleware");
const { busRouteSchema } = require("../../schemas/admin/busRoute.schema");

router.get(
    "/",
    checkAccessToken("Admin"),
    checkPermission(["READ_BUS"]),
    controller.getAll
);
router.post(
    "/:companyId",
    checkAccessToken("Admin"),
    checkPermission(["CREATE_BUS"]),
    upload.single("logo"),
    uploadCloud.upload,
    validateInput(busRouteSchema),
    controller.create
);

router.get(
    "/:id",
    checkAccessToken("Admin"),
    checkPermission(["READ_BUS"]),
    controller.getById
);
router.patch(
    "/:id",
    checkAccessToken("Admin"),
    checkPermission(["UPDATE_BUS"]),
    upload.single("logo"),
    uploadCloud.upload,
    validateInput(busRouteSchema),
    controller.update
);
router.delete(
    "/:id",
    checkAccessToken("Admin"),
    checkPermission(["DELETE_BUS"]),
    controller.softDelete
);

module.exports = router;
