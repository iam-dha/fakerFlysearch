const express = require("express");
const router = express.Router();
const multer = require("multer");
const fileUpload = multer();
const controller = require("../../controllers/admin/room.controller");
const uploadCloud = require("../../middlewares/uploadCloud.middleware");

router.get("/", controller.getAllRooms);
router.post(
  "/",
  fileUpload.array("thumbnails"),
  uploadCloud.uploadCloudImages("thumbnails"),
  controller.createRoom
);
router.patch(
  "/:id",
  fileUpload.array("thumbnails"),
  uploadCloud.uploadCloudImages("thumbnails"),
  controller.updateRoom
);
router.delete("/:id", controller.deleteRoom);

module.exports = router;
