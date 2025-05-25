const express = require("express");
const multer = require("multer");
const router = express.Router();
const controller = require("../../controllers/admin/busCompany.controller");

const upload = multer();
const uploadCloud = require("../../middlewares/uploadCloud.middleware");

const {
    checkAccessToken,
    checkPermission,
} = require("../../middlewares/authenticate.middleware");
const { validateInput } = require("../../middlewares/validate.middleware");
const {
    createOrUpdateSchema,
} = require("../../schemas/admin/busCompany.schema");

router.get(
    "/",
    checkAccessToken("Admin"),
    checkPermission(["READ_BUS"]),
    controller.getAll
);
router.post(
    "/",
    checkAccessToken("Admin"),
    checkPermission(["CREATE_BUS"]),
    upload.single("logo"),
    uploadCloud.upload,
    validateInput(createOrUpdateSchema),
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
    validateInput(createOrUpdateSchema),
    controller.update
);
router.delete(
    "/:id",
    checkAccessToken("Admin"),
    checkPermission(["DELETE_BUS"]),
    controller.softDelete
);

module.exports = router;
