const express = require("express");
const multer = require("multer");
const controller = require("../../controllers/admin/hotel.controller");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadCloud = require("../../middlewares/uploadCloud.middleware");
const authMiddleware = require("../../middlewares/authenticate.middleware");

const router = express.Router();

router.get(
    "/",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["READ_HOTEL"]),
    controller.getAllHotels
);

router.post(
    "/",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["CREATE_HOTEL"]),
    upload.single("thumbnail"),
    uploadCloud.upload,
    controller.createHotel
);

router.get(
    "/rooms/:id",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["READ_HOTEL"]),
    controller.getHotelRoom
);

router.get(
    "/:id",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["READ_HOTEL"]),
    controller.getHotelById
);

router.patch(
    "/:id",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["UPDATE_HOTEL"]),
    upload.single("thumbnail"),
    uploadCloud.upload,
    controller.updateHotel
);

router.patch(
    "/rooms/:id",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["UPDATE_HOTEL"]),
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "images", maxCount: 10 },
    ]),
    uploadCloud.uploadRoomImages,
    controller.updateHotelRoom
);

router.post(
    "/:id/rooms",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["CREATE_HOTEL"]),
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "images", maxCount: 10 },
    ]),
    uploadCloud.uploadRoomImages,
    controller.createHotelRoom
);

router.delete(
    "/:id",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["DELETE_HOTEL"]),
    controller.deleteHotel
);

router.delete(
    "/rooms/:id",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["DELETE_HOTEL"]),
    controller.deleteHotelRoom
);

module.exports = router;
