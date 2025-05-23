const express = require("express");
const multer = require("multer");
const router = express.Router();
const controller = require("../../controllers/admin/flight.controller");
const authMiddleware = require("../../middlewares/authenticate.middleware");
const validateMiddleWare = require("../../middlewares/validate.middleware")
const {
    flightFullSchema
} = require("../../schemas/flight.schema");
const fileUpload = multer();
const uploadCloud = require("../../middlewares/uploadCloud.middleware");

router.get(
    "/",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["READ_FLIGHT"]),
    controller.getAllFlights
);

router.get(
    "/:flight_number",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["READ_FLIGHT"]),
    controller.getFlight
);

router.post(
    "/",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["READ_FLIGHT"]),
    fileUpload.single("thumbnail"),
    uploadCloud.upload,
    validateMiddleWare.validateInput(flightFullSchema),
    controller.createFlight
);

router.patch(
    "/:flight_number",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["READ_FLIGHT"]),
    validateMiddleWare.validateInput(flightFullSchema),
    controller.updateFlight
);

router.delete(
    "/:flight_number",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["READ_FLIGHT"]),
    controller.deleteFlight
);

module.exports = router;
